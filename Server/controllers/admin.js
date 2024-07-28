// importing dependencies
const fs = require("fs");
const path = require("path");

// importing models
const Book = require("../models/book");
const User = require("../models/user");
const Activity = require("../models/activity");
const Issue = require("../models/issue");
const Comment = require("../models/comment");
const Request = require("../models/request");
const Return = require("../models/return");
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
// admin -> show dashboard working procedure
/*
    1. Get user, book and activity count
    2. Fetch all activities in chunk (for pagination)
    3. Render admin/index
*/
exports.getDashboard = async (req, res) => {
  var page = req.params.page || 1;
  try {
    const users_count = await User.find().countDocuments({ isAdmin: false });
    const books_count = await Book.find().countDocuments();
    const activity_count = await Activity.find().countDocuments();
    const activities = await Activity.find()
      .sort({ entryTime: -1 })
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .exec();
    return res.json({
      users_count: users_count,
      books_count: books_count,
      activities: activities,
      current: page,
      pages: Math.ceil(activity_count / PER_PAGE),
    });
  } catch (err) {
    console.log(err);
  }
};

// admin -> delete profile working procedure
/*
    1. Find admin by user_id and remove
    2. Redirect back to /
*/
exports.deleteAdminProfile = async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.user._id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// admin -> get the book to be updated
exports.getUpdateBook = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);
    await res.json({
      book: book,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "error" });
  }
};

// admin -> post update book
exports.postUpdateBook = async (req, res, next) => {
  try {
    const book_info = req.body.book;
    const book_id = req.params.book_id;

    await Book.findByIdAndUpdate(book_id, book_info);

    res.json({ success: "Book updated successfully." });
  } catch (err) {
    console.log(err);
    return res.json({ error: "error" });
  }
};

// admin -> get user list
exports.getUserList = async (req, res, next) => {
  try {
    const page = req.params.page || 1;

    const users = await User.find()
      .sort("-joined")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const users_count = await User.find().countDocuments({ isAdmin: false });

    await res.render("admin/users", {
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
      global: await global(),
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> show searched user
exports.postShowSearchedUser = async (req, res, next) => {
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
      req.flash("error", "User not found!");
      return res.redirect("back");
    } else {
      await res.render("admin/users", {
        users: users,
        current: page,
        pages: 0,
        global: await global(),
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> flag/unflag user
exports.getFlagUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findById(user_id);

    if (user.violationFlag) {
      user.violationFlag = false;
      await user.save();
      req.flash(
        "success",
        `An user named ${user.firstName} ${user.lastName} is just unflagged!`
      );
    } else {
      user.violationFlag = true;
      await user.save();
      req.flash(
        "warning",
        `An user named ${user.firstName} ${user.lastName} is just flagged!`
      );
    }

    res.redirect("/admin/users/1");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> show one user
exports.getUserProfile = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findById(user_id);
    const issues = await Issue.find({ "user_id.id": user_id });
    const comments = await Comment.find({ "author.id": user_id });
    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );

    await res.render("admin/user", {
      user: user,
      issues: issues,
      activities: activities,
      comments: comments,
      global: await global(),
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> show all activities of one user
exports.getUserAllActivities = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );
    await res.render("admin/activities", {
      activities: activities,
      global: await global(),
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> show activities by category
exports.postShowActivitiesByCategory = async (req, res, next) => {
  try {
    const category = req.body.category;
    const activities = await Activity.find({ category: category });

    await res.render("admin/activities", {
      activities: activities,
      global: await global(),
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> delete a user
exports.getDeleteUser = async (req, res, next) => {
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

    res.redirect("/admin/users/1");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> add new book
exports.getAddNewBook = async (req, res, next) => {
  await res.render("admin/addBook", {
    global: await global(),
  });
};

exports.postAddNewBook = async (req, res, next) => {
  try {
    const book_info = req.body.book;

    const isDuplicate = await Book.find(book_info);

    if (isDuplicate.length > 0) {
      req.flash("error", "This book is already registered in inventory");
      return res.redirect("back");
    }

    const new_book = new Book(book_info);
    await new_book.save();
    req.flash(
      "success",
      `A new book named ${new_book.title} is added to the inventory`
    );
    res.redirect("/admin/bookInventory/all/all/1");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> get profile
exports.getAdminProfile = async (req, res, next) => {
  await res.render("admin/profile", {
    global: await global(),
  });
};

// admin -> update profile
exports.postUpdateAdminProfile = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const update_info = req.body.admin;

    await User.findByIdAndUpdate(user_id, update_info);

    res.redirect("/admin/profile");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> update password
exports.putUpdateAdminPassword = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const old_password = req.body.oldPassword;
    const password = req.body.newPassword;
    const admin = await User.findById(user_id);
    await admin.changePassword(old_password, password);
    await admin.save();

    req.flash(
      "success",
      "Your password is changed recently. Please login again to confirm"
    );
    res.redirect("/auth/admin-login");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// admin -> get stock out book inventory working procedure
/*
    1. Construct search object
    2. Fetch books by search object
    3. Render admin/stock
*/
exports.getAdminStock = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter;
    const value = req.params.value;

    // console.log(filter, value);
    // // constructing search object
    let searchObj = {
      stock: 0,
    };
    if (filter !== "all" && value !== "all") {
      // fetch books by search value and filter
      searchObj[filter] = value;
    }

    // get the book counts
    const books_count = await Book.find(searchObj).countDocuments();

    // fetching books
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // rendering admin/bookInventory
    await res.render("admin/stock", {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    // console.log(err.messge);
    return res.redirect("back");
  }
};

// admin -> return book stock inventory by search query working procedure
/*
    same as getAdminBookInventory method
*/
exports.postAdminStock = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;

    if (value == "") {
      req.flash(
        "error",
        "Search field is empty. Please fill the search field in order to get a result"
      );
      return res.redirect("back");
    }
    const searchObj = {
      stock: 0,
    };
    searchObj[filter] = value;

    // get the books count
    const books_count = await Book.find(searchObj).countDocuments();

    // fetch the books by search query
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // rendering admin/bookInventory
    await res.render("admin/stock", {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    // console.log(err.message);
    return res.redirect("back");
  }
};

// admin -> get Request  book inventory working procedure
/*
    1. Construct search object
    2. Fetch books by search object
    3. Render admin/request
*/

exports.getAdminRequest = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter;
    const value = req.params.value;

    if (filter != "all") {
      if (filter == "username") {
        filter = `user_id.username`;
      } else {
        filter = `book_info.${filter}`;
      }
    }

    let searchObj = {};

    if (filter !== "all" && value !== "all") {
      // fetch books by search value and filter
      searchObj[filter] = value;
    }

    // get the Request counts
    const Request_count = await Request.find(searchObj).countDocuments();

    // fetching Request
    const request = await Request.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .populate({
        path: "book_info.id",
        select: "stock",
      })
      .exec();

    await res.render("admin/request", {
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    // console.log(err.messge);
    return res.redirect("back");
  }
};

// admin -> return book request inventory by search query working procedure
/*
    same as getAdminBookInventory method
*/
exports.postAdminRequest = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    let filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;

    if (value == "") {
      req.flash(
        "error",
        "Search field is empty. Please fill the search field in order to get a result"
      );
      return res.redirect("back");
    }

    if (filter != "all") {
      if (filter == "username") {
        filter = `user_id.username`;
      } else {
        filter = `book_info.${filter}`;
      }
    }

    const searchObj = {};
    searchObj[filter] = value;

    // get the Request counts
    const Request_count = await Request.find(searchObj).countDocuments();

    // fetching Request
    const request = await Request.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .populate({
        path: "book_info.id",
        select: "stock",
      })
      .exec();

    // rendering admin/Request Book Inventory
    await res.render("admin/request", {
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    // console.log(err.message);
    return res.redirect("back");
  }
};

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

exports.getAcceptRequest = async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(request.user_id.id);
  const book = await Book.findById(request.book_info.id);

  if (user.violationFlag) {
    req.flash(
      "error",
      "user are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books"
    );
    return res.redirect("back");
  }

  if (user.bookIssueInfo.length >= 5) {
    req.flash("warning", "You can't issue more than 5 books at a time");
    return res.redirect("back");
  }

  if (book.stock <= 0) {
    req.flash("warning", "Book is not in stock");
    return res.redirect("back");
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

    //redirect
    res.redirect("/admin/bookRequest/all/all/1");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

//admin -> Decline book Request
/*  
    ? work Flow
    1. fetch request doc by params.id
    2. fetch user by request.user_id
    3. logging activity
    4. clearing request
    5. redirect('/admin/bookRequest/all/all/1)
 */

exports.getDeclineRequest = async (req, res, next) => {
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

    //redirect
    res.redirect("/admin/bookRequest/all/all/1");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// admin -> get Return  book inventory working procedure
/*
    1. Construct search object
    2. Fetch books by search object
    3. Render admin/return
*/

exports.getAdminReturn = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter;
    const value = req.params.value;

    if (filter != "all") {
      if (filter == "username") {
        filter = `user_id.username`;
      } else {
        filter = `book_info.${filter}`;
      }
    }

    let searchObj = {};
    if (filter !== "all" && value !== "all") {
      // fetch books by search value and filter
      searchObj[filter] = value;
    }

    // get the Return counts
    const Request_count = await Return.find(searchObj).countDocuments();

    // fetching Return
    const request = await Return.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .exec();

    await res.render("admin/return", {
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    console.log(err.messge);
    return res.redirect("back");
  }
};

// admin -> return book request inventory by search query working procedure
/*
    same as getAdminBookInventory method
*/
exports.postAdminReturn = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    let filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;

    if (value == "") {
      req.flash(
        "error",
        "Search field is empty. Please fill the search field in order to get a result"
      );
      return res.redirect("back");
    }

    if (filter != "all") {
      if (filter == "username") {
        filter = `user_id.username`;
      } else {
        filter = `book_info.${filter}`;
      }
    }

    const searchObj = {};
    searchObj[filter] = value;
    // get the Request counts
    const Request_count = await Return.find(searchObj).countDocuments();

    // fetching Request
    const request = await Return.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .exec();

    // rendering admin/Request Book Inventory
    await res.render("admin/return", {
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
      global: await global(),
    });
  } catch (err) {
    console.log(err.message);
    return res.redirect("back");
  }
};

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

exports.getAcceptReturn = async (req, res, next) => {
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
    res.redirect("/admin/bookReturn/all/all/1");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

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

exports.getDeclineReturn = async (req, res, next) => {
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
    res.redirect("/admin/bookReturn/all/all/1");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
