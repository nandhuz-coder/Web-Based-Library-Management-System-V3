const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware");
// importing dependencies
const fs = require("fs");

// importing models
const Book = require("../models/book"),
  User = require("../models/user"),
  Activity = require("../models/activity"),
  Issue = require("../models/issue"),
  Comment = require("../models/comment"),
  Request = require("../models/request"),
  Return = require("../models/return");

// importing utilities
const deleteImage = require("../utils/delete_image");

// GLOBAL_VARIABLES
const PER_PAGE = 10;

async function global() {
  let value1 = (await Request.find().countDocuments()) || 0;
  let value2 = (await Book.find().countDocuments({ stock: 0 })) || 0;
  let value3 = (await Return.find().countDocuments()) || 0;
  let value = {
    reqbook: value1,
    stock: value2,
    return: value3,
  };
  return value;
}

router.get("/api/users/suggestions", async (req, res, next) => {
  try {
    const searchValue = req.query.q;
    const regex = new RegExp(searchValue, "i");
    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { username: regex },
        { email: regex },
      ],
      isAdmin: false,
    })
      .limit(10)
      .select("firstName lastName username");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//admin -> global & user
router.get("/api/global", middleware.isAdmin, async (req, res) => {
  try {
    return res.json({
      global: await global(),
      currentUser: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

// admin -> delete book
router.get("/api/admin/book/delete/:book_id", async (req, res) => {
  try {
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);
    await book.deleteOne();
    res.json({ success: `A book named ${book.title} is just deleted!` });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
});

// admin -> Update book (post)
router.post("/api/admin/book/update/:book_id", async (req, res) => {
  try {
    const book_info = req.body.book;
    const book_id = req.params.book_id;
    await Book.findByIdAndUpdate(book_id, book_info);
    res.json({ success: "Book updated successfully." });
  } catch (err) {
    console.log(err);
    return res.json({ error: "error" });
  }
});

// admin -> show searched user
router.post("/api/admin/users/:page", async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const search_value = req.body.searchUser;

    const users = await User.find({
      $or: [
        { firstName: search_value },
        { lastName: search_value },
        { username: search_value },
        { email: search_value },
      ],
    });
    if (users.length <= 0) {
      return res.json({ error: "User not found!" });
    } else {
      await res.json({
        users: users,
        current: page,
        pages: 0,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/admin/users/delete/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);
    await user.deleteOne();

    let imagePath = `images/${user.image}`;
    if (fs.existsSync(imagePath)) {
      deleteImage(imagePath);
    }

    await Issue.deleteMany({ "user_id.id": user_id });
    await Comment.deleteMany({ "author.id": user_id });
    await Activity.deleteMany({ "user_id.id": user_id });
    await Request.deleteMany({ "user_id.id": user_id });
    await Return.deleteMany({ "user_id.id": user_id });

    return res.json({ success: `${user.username} has removed` });
  } catch (err) {
    console.log(err);
    return res.json({ error: `unknown error` });
  }
});

router.get("/api/admin/users/flagged/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);

    if (user.violationFlag) {
      user.violationFlag = false;
      await user.save();
      return res.json({
        success: `An user named ${user.firstName} ${user.lastName} is just unflagged!`,
      });
    } else {
      user.violationFlag = true;
      await user.save();
      return res.json({
        warning: `An user named ${user.firstName} ${user.lastName} is just flagged!`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: `unknown error` });
  }
});

router.post("/api/admin/add/book", async (req, res) => {
  try {
    const book_info = req.body.book;
    const isDuplicate = await Book.find(book_info);

    if (isDuplicate.length > 0) {
      return res.json({
        error: "This book is already registered in inventory",
      });
    }
    const new_book = new Book(book_info);
    await new_book.save();
    return res.json({
      success: `A new book named ${new_book.title} is added to the inventory`,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: `unknown error` });
  }
});

//admin -> Accept book Request
/*  
    ? work Flow
    1. fetch request doc by params.id
    2. fetch user by request.user_id
    3. fetch book by request.book_info
    4. check user violation
    5. check user book issued
    6. check book stock
    7. registering book issue
    8. clearing request
    9. logging activity
    10 redirect('/admin/bookRequest/all/all/1)
 */

router.get("/api/admin/book/request/accept/:id", async (req, res) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(request.user_id.id);
  const book = await Book.findById(request.book_info.id);

  if (user.violationFlag) {
    return res.json({
      error:
        "user are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books",
    });
  }

  if (user.bookIssueInfo.length >= 5) {
    return res.json({ error: "You can't issue more than 5 books at a time" });
  }

  if (book.stock <= 0) {
    return res.json({ error: "Book is not in stock" });
  }

  try {
    // registering issue
    book.stock -= 1;
    const issue = new Issue({
      book_info: {
        id: book._id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        category: book.category,
        stock: book.stock,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // putting issue record on individual user document
    await user.bookIssueInfo.push(book._id);

    //Clearing request
    await Request.findByIdAndDelete(req.params.id);
    user.bookRequestInfo.pull({ _id: request.book_info.id });

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Issue",
      time: {
        id: issue._id,
        issueDate: issue.book_info.issueDate,
        returnDate: issue.book_info.returnDate,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // await ensure to synchronously save all database alteration
    await issue.save();
    await user.save();
    await book.save();
    await activity.save();
    res.json({ success: `${book.title} has been issued to ${user.username}` });
  } catch (err) {
    console.log(err);
    res.json({ error: `unknown error` });
  }
});

//admin -> Decline book Request
/*  
      ? work Flow
      1. fetch request doc by params.id
      2. fetch user by request.user_id
      3. logging activity
      4. clearing request
      5. redirect('/admin/bookRequest/all/all/1)
   */
router.get("/api/admin/book/request/decline/:id", async (req, res) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(request.user_id.id);

  try {
    // logging the activity
    const activity = new Activity({
      info: {
        id: request._id,
        title: request.book_info.title,
      },
      category: "Decline",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    //Clearing request
    await Request.findByIdAndDelete(req.params.id);
    user.bookRequestInfo.pull({ _id: request.book_info.id });

    // await ensure to synchronously save all database alteration
    await user.save();
    await activity.save();

    res.json({ error: `book request has been declined...` });
  } catch (err) {
    console.log(err);
    res.json({ error: `unknown error` });
  }
});

//admin -> Accept book Return
/*  
    ? work Flow
    1. fetch return doc by params.id
    2. fetch user by request.user_id
    3. fetch book by request.book_info
    4. fetch issue by request.book_info
    5. remove book object ID from user
    6. remove issue and return document
    7. book stock arranged
    8. logging activity
    9. redirect('/admin/bookReturn/all/all/1)
 */

router.get("/api/admin/book/return/accept/:id", async (req, res, next) => {
  try {
    const request = await Return.findById(req.params.id);
    const user = await User.findById(request.user_id.id);
    const book = await Book.findById(request.book_info.id);
    const issue = await Issue.findOne({
      "user_id.id": request.user_id.id,
      "book_info.id": request.book_info.id,
    });

    //remove book object ID from user
    await user.bookReturnInfo.pull(book._id);
    await user.bookIssueInfo.pull(book._id);

    //remove issue and return document
    await issue.deleteOne();
    await request.deleteOne();

    //addming book stock
    book.stock++;

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Return",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // await ensure to synchronously save all database alteration
    await user.save();
    await book.save();
    await activity.save();

    //redirect
    res.json({ success: "Request has been accepted" });
  } catch (err) {
    console.log(err);
    res.json({ error: "unknown error" });
  }
});

//admin -> Decline book Return
/*  
 ? work Flow
  1. fetch return doc by params.id
  2. fetch user by request.user_id
  3. fetch book by request.book_info
  4. remove book object ID from user
  5. remove return document
  6. logging activity
  7. redirect('/admin/bookReturn/all/all/1)
 */

router.get("/api/admin/book/return/decline/:id", async (req, res, next) => {
  try {
    const request = await Return.findById(req.params.id);
    const user = await User.findById(request.user_id.id);
    const book = await Book.findById(request.book_info.id);
    const issue = await Issue.findOne({
      "user_id.id": request.user_id.id,
      "book_info.id": request.book_info.id,
    });
    //remove book object ID from user
    await user.bookReturnInfo.pull(book._id);
    issue.book_info.isReturn = false;

    //remove return document
    await request.deleteOne();

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Return decline",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // await ensure to synchronously save all database alteration
    await user.save();
    await activity.save();
    await issue.save();

    //redirect
    res.json({ error: "Request has been removed" });
  } catch (err) {
    console.log(err);
    res.json({ error: "unknown error" });
  }
});

// admin -> show activities by category
router.post("/api/admin/users/activities/:id", async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const category = req.body.category;
    const activities = await Activity.find({
      category: category,
      "user_id.id": user_id,
    });

    return res.json({
      activities: activities,
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
});

// admin -> update profile
router.post("/api/admin/edit/profile", async (req, res) => {
  try {
    const user_id = req.user._id;
    const update_info = req.body.admin;

    await User.findByIdAndUpdate(user_id, update_info);
    res.json({ success: "Successfully edited admin." });
  } catch (err) {
    console.log(err);
    res.json({ error: "error editing admin." });
  }
});

// admin -> update password
router.post("/admin/update-password", async (req, res) => {
  try {
    const user_id = req.user._id;
    const old_password = req.body.oldPassword;
    const password = req.body.newPassword;
    const admin = await User.findById(user_id);
    await admin.changePassword(old_password, password);
    await admin.save();
    res.json({ success: "Successfully changed password." });
  } catch (err) {
    console.log(err);
    res.json({ error: "failed changing password." });
  }
});

// admin -> delete profile working procedure
/*
    1. Find admin by user_id and remove
    2. Redirect back to /
*/
router.delete("/api/admin/delete-profile", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user._id);
    res.json(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
module.exports = router;
