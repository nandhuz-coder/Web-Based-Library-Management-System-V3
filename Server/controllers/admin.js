// importing dependencies
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// importing models
const Book = require("../models/book");
const User = require("../models/user");
const Activity = require("../models/activity");
const Issue = require("../models/issue");
const Comment = require("../models/comment");
const Request = require("../models/request");
const Return = require("../models/return");

// GLOBAL_VARIABLES
const PER_PAGE = 10;

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
exports.getUserProfile = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!ObjectId.isValid(user_id)) {
      return res.json({ error: "Invalid ID format", NoRender: true });
    }

    const user = await User.findById(user_id);
    if (!user) return res.json({ error: "no user found", NoRender: true });

    const issues = await Issue.find({ "user_id.id": user_id });
    const comments = await Comment.find({ "author.id": user_id });
    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );

    await res.json({
      user: user,
      issues: issues,
      activities: activities,
      comments: comments,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "unknown error" });
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
exports.getAdminProfile = async (req, res) => {
  await res.json({ username: req.user.username, email: req.user.email });
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
