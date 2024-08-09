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
  res.render("user/profile");
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

    req.flash(
      "success",
      "Your password is recently updated. Please log in again to confirm"
    );
    res.redirect("/auth/user-login");
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

// upload image
exports.postUploadUserImage = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);

    let imageUrl;
    if (req.file) {
      imageUrl = `${uid()}__${req.file.originalname}`;
      let filename = `public/image/user-profile/${imageUrl}`;
      let previousImagePath = `public/image/user-profile/${user.image}`;

      const imageExist = fs.existsSync(previousImagePath);
      if (imageExist) {
        deleteImage(previousImagePath);
      }
      await sharp(req.file.path).rotate().resize(500, 500).toFile(filename);

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else {
      imageUrl = "profile.png";
    }

    user.image = imageUrl;
    await user.save();

    const activity = new Activity({
      category: "Upload Photo",
      user_id: {
        id: req.user._id,
        username: user.username,
      },
    });
    await activity.save();

    res.redirect("/user/1/profile");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

//user -> notification
exports.getNotification = async (req, res, next) => {
  res.render("user/notification");
};

// user -> show return-renew page
exports.getShowRenewReturn = async (req, res, next) => {
  const user_id = req.user._id;
  try {
    const issue = await Issue.find({ "user_id.id": user_id });
    res.render("user/return-renew", { user: issue });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> renew book working procedure
/*
    1. construct the search object
    2. fetch issues based on search object
    3. increament return date by 7 days set isRenewed = true
    4. Log the activity
    5. save all db alteration
    6. redirect to /books/return-renew
*/
exports.postRenewBook = async (req, res, next) => {
  try {
    const searchObj = {
      "user_id.id": req.user._id,
      "book_info.id": req.params.book_id,
    };
    const issue = await Issue.findOne(searchObj);
    // adding extra 7 days to that issue
    let time = issue.book_info.returnDate.getTime();
    issue.book_info.returnDate = time + 7 * 24 * 60 * 60 * 1000;
    issue.book_info.isRenewed = true;

    // logging the activity
    const activity = new Activity({
      info: {
        id: issue._id,
        title: issue.book_info.title,
      },
      category: "Renew",
      time: {
        id: issue._id,
        issueDate: issue.book_info.issueDate,
        returnDate: issue.book_info.returnDate,
      },
      user_id: {
        id: req.user._id,
        username: req.user.username,
      },
    });

    await activity.save();
    await issue.save();

    res.redirect("/books/return-renew");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> return book working procedure
/*
    1. Find the position of the book to be returned from user.bookIssueInfo
    2. Fetch the book from db and increament its stock by 1
    3. Remove issue record from db
    4. Pop bookIssueInfo from user by position
    5. Log the activity
    6. refirect to /books/return-renew
*/
exports.postReturnBook = async (req, res, next) => {
  try {
    // finding user & book.
    const user = await User.findById(req.user._id);
    const book = await Book.findById(req.params.id);
    const issue = await Issue.findOne({
      "book_info.id": req.params.id,
      "user_id.id": req.user._id,
    });
    const Book_return = new Return({
      user_id: {
        id: req.user._id,
        username: req.user.username,
      },
      book_info: {
        id: book._id,
        title: book.title,
        author: book.author,
        category: book.category,
      },
      issue_id: {
        id: issue._id,
      },
    });

    await user.bookReturnInfo.push(book._id);
    issue.book_info.isReturn = true;
    const activity = new Activity({
      info: {
        id: Book_return.book_info.id,
        title: Book_return.book_info.title,
      },
      category: "Return apply",
      user_id: {
        id: req.user._id,
        username: req.user.username,
      },
    });

    await Book_return.save();
    await user.save();
    await issue.save();
    await activity.save();

    // redirecting
    res.redirect("/books/return-renew");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
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

//user -> request a book
exports.postRequestbook = async (req, res, next) => {
  if (req.user.violationFlag) {
    return res.json({
      error:
        "You are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books",
    });
  }

  if (req.user.bookIssueInfo.length >= 5) {
    return res.json({ error: "You can't issue more than 5 books at a time" });
  }

  try {
    const book = await Book.findById(req.params.book_id);
    const user = await User.findById(req.params.user_id);

    if (book.stock == 0) {
      req.flash("warning", "No stock available at this moment.");
      return res.redirect("back");
    }

    // registering request

    const request = new Request({
      book_info: {
        id: book._id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        category: book.category,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // putting request record on individual user document
    user.bookRequestInfo.push(book._id);

    // logging the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Request",
      time: {
        id: Request._id,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // await ensure to synchronously save all database alteration
    await request.save();
    await user.save();
    await book.save();
    await activity.save();

    // api alert
    return await res.json({
      success: `${book.title} is successfully requested.`,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
