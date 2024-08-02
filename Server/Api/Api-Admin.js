const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
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

module.exports = router;
