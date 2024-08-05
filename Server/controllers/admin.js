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

exports.getInventory = async (req, res) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter.toLowerCase();
    const value = req.params.value;

    // constructing search object
    let searchObj = {};
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
    await res.json({
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err);
    return res.json("error");
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

// admin -> get user list
exports.getUserList = async (req, res, next) => {
  try {
    const page = req.params.page || 1;

    const users = await User.find()
      .sort("-joined")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const users_count = await User.find().countDocuments({ isAdmin: false });

    await res.json({
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "unknown error" });
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
    await res.json({
      activities: activities,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "unknown error" });
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
exports.getAdminStock = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const filter = req.params.filter || "all";
    const value = req.params.value || "all";

    let searchObj = { stock: 0 };
    if (filter !== " " && value !== " ") {
      searchObj[filter] = value;
    }

    const books_count = await Book.find(searchObj).countDocuments();

    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    return res.json({
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.error("Error fetching admin stock:", err);
    return res.json({
      error: "An error occurred while fetching the stock data.",
    });
  }
};

// admin -> get Request  book inventory working procedure
/*
    1. Construct search object
    2. Fetch books by search object
    3. Render admin/request
*/

exports.getAdminRequest = async (req, res) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter || "all";
    const value = req.params.value || "all";

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

    await res.json({
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err.messge);
    res.json({ error: "unknown error" });
  }
};

// admin -> get Return  book inventory working procedure
/*
    1. Construct search object
    2. Fetch books by search object
    3. Render admin/return
*/

exports.getAdminReturn = async (req, res) => {
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

    await res.json({
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err.messge);
    return res.redirect("back");
  }
};
