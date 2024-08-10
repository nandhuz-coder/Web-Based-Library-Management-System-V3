// importing dependencies
const sharp = require("sharp");
const uid = require("uid");
const fs = require("fs");

// importing models
const User = require("../models/user"),
  Activity = require("../models/activity"),
  Book = require("../models/book"),
  Issue = require("../models/issue"),
  Comment = require("../models/comment"),
  Request = require("../models/request"),
  Return = require("../models/return");

// importing utilities
const deleteImage = require("../utils/delete_image");

// GLOBAL_VARIABLES
const PER_PAGE = 5;

// user -> profile
exports.getUserProfile = (req, res, next) => {
  res.json({ currentuser: req.user });
};

// user -> update/change password
exports.putUpdatePassword = async (req, res, next) => {
  const username = req.user.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;

  try {
    const user = await User.findByUsername(username);
    await user.changePassword(oldPassword, newPassword);
    await user.save();

    // logging activity
    const activity = new Activity({
      category: "Update Password",
      user_id: {
        id: req.user._id,
        username: req.user.username,
      },
    });
    await activity.save();

    res.json({
      success:
        "Your password is recently updated. Please log in again to confirm",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> update profile
exports.putUpdateUserProfile = async (req, res, next) => {
  try {
    const userUpdateInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
    };
    await User.findByIdAndUpdate(req.user._id, userUpdateInfo);

    // logging activity
    const activity = new Activity({
      category: "Update Profile",
      user_id: {
        id: req.user._id,
        username: req.user.username,
      },
    });
    await activity.save();

    res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

//user -> notification
exports.getNotification = async (req, res, next) => {
  res.render("user/notification");
};

// user -> show return-renew page
exports.getShowRenewReturn = async (req, res) => {
  const user_id = req.user._id;
  try {
    const issue = await Issue.find({ "user_id.id": user_id });
    res.json({ user: issue, currentUser: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unknown error" });
  }
};

// user -> create new comment working procedure
/* 
    1. Find the book to be commented by id
    2. Create new Comment instance and fill information inside it
    3. Log the activity
    4. Redirect to /books/details/:book_id
*/
exports.postNewComment = async (req, res, next) => {
  try {
    const comment_text = req.body.comment;
    const user_id = req.user._id;
    const username = req.user.username;

    // fetching the book to be commented by id
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);

    // creating new comment instance
    const comment = new Comment({
      text: comment_text,
      author: {
        id: user_id,
        username: username,
      },
      book: {
        id: book._id,
        title: book.title,
      },
    });
    await comment.save();

    // pushing the comment id to book
    book.comments.push(comment._id);
    await book.save();

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> update existing comment working procedure
/*
    1. Fetch the comment to be updated from db and update
    2. Fetch the book to be commented for logging book id, title in activity
    3. Log the activity
    4. Redirect to /books/details/"+book_id
*/
exports.postUpdateComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  const comment_text = req.body.comment;
  const book_id = req.params.book_id;
  const username = req.user.username;
  const user_id = req.user._id;

  try {
    // fetching the comment by id
    await Comment.findByIdAndUpdate(comment_id, comment_text);

    // fetching the book
    const book = await Book.findById(book_id);

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Update Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // redirecting
    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> delete existing comment working procedure
/* 
    1. Fetch the book info for logging info
    2. Find the position of comment id in book.comments array in Book model
    3. Pop the comment id by position from Book
    4. Find the comment and remove it from Comment
    5. Log the activity
    6. Redirect to /books/details/" + book_id
*/
exports.deleteComment = async (req, res, next) => {
  const book_id = req.params.book_id;
  const comment_id = req.params.comment_id;
  const user_id = req.user._id;
  const username = req.user.username;
  try {
    // fetching the book
    const book = await Book.findById(book_id);

    // finding the position and popping comment_id
    const pos = book.comments.indexOf(comment_id);
    book.comments.splice(pos, 1);
    await book.save();

    // removing comment from Comment
    await Comment.findByIdAndDelete(comment_id);

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Delete Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // redirecting
    res.redirect("/books/details/" + book_id);
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> delete user account
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user_id = req.user._id;

    const user = await User.findById(user_id);
    await user.remove();

    let imagePath = `images/${user.image}`;
    if (fs.existsSync(imagePath)) {
      deleteImage(imagePath);
    }

    await Issue.deleteMany({ "user_id.id": user_id });
    await Comment.deleteMany({ "author.id": user_id });
    await Activity.deleteMany({ "user_id.id": user_id });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};
