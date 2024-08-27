const path = require("path");
const fs = require("fs");
const deleteImage = require("../../utils/image/delete_image");
const Resize = require("../../utils/image/resize");

// importing models
const User = require("../../models/user");
const Activity = require("../../models/activity");
const Book = require("../../models/book");
const Issue = require("../../models/issue");
const Comment = require("../../models/comment");
const Request = require("../../models/request");
const Return = require("../../models/return");

const PER_PAGE = 12;

exports.getUserPage = async (req, res) => {
  try {
    let warning = [];
    const page = parseInt(req.params.page, 10) || 1;
    if (!req.user) return res.status(500).json({ error: "try login again.." });
    const user_id = req.user._id;

    // Fetch user info from the database
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check for overdue issues
    if (user.bookIssueInfo.length > 0) {
      const issues = await Issue.find({ "user_id.id": user._id });

      for (let issue of issues) {
        if (issue.book_info.returnDate < Date.now()) {
          user.violatonFlag = true;
          await user.save();
          warning.push(
            `You are flagged for not returning ${issue.book_info.title} in time`
          );
        }
      }
    }

    // Fetch activities with pagination
    const activities = await Activity.find({ "user_id.id": user._id })
      .sort({ _id: -1 })
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);

    const activity_count = await Activity.countDocuments({
      "user_id.id": user._id,
    });

    res.json({
      user: user,
      current: page,
      pages: Math.ceil(activity_count / PER_PAGE),
      activities: activities,
      warning: warning,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Unknown error occurred" });
  }
};

exports.renewBook = async (req, res) => {
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

    res.json({ success: `${issue.book_info.title} has been renewed.` });
  } catch (err) {
    console.log(err);
    res.json({ error: `unknown error` });
  }
};

exports.returnBook = async (req, res, _next) => {
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
    res.json({
      success: `${issue.book_info.title} return appilication has been submitted.`,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: `unknown error` });
  }
};

exports.changeImage = async (req, res) => {
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    let imageUrl;
    if (req.file) {
      const imageDir = path.join(__dirname, "../public/image/user-profile");
      const resize = new Resize(imageDir);
      const filename = await resize.save(req.file.buffer); // Save the image and get the filename
      imageUrl = filename;

      let previousImagePath = path.join(imageDir, user.image);
      // Ensure the directory exists
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      // Check if the previous image is not the default profile image
      if (user.image !== "profile.png") {
        const imageExist = fs.existsSync(previousImagePath);
        if (imageExist) {
          fs.unlinkSync(previousImagePath);
        }
      }
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
    res.json({ success: "successfully changed image" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error processing the image" });
  }
};

exports.deleteProfile = async (req, res, _next) => {
  try {
    const user_id = req.user._id;

    const user = await User.findById(user_id);
    await user.remove();

    let imagePath = `public/image/user-profile/${user.image}`;

    if (imagePath != "public/image/user-profile/profile.png") {
      const imageExist = fs.existsSync(imagePath);
      if (imageExist) {
        deleteImage(imagePath);
      }
    }

    await Issue.deleteMany({ "user_id.id": user_id });
    await Comment.deleteMany({ "author.id": user_id });
    await Activity.deleteMany({ "user_id.id": user_id });
    await Return.deleteMany({ "user_id.id": user_id });
    await Request.deleteMany({ "user_id.id": user_id });

    res.json(true);
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

exports.updateProfile = async (req, res, _next) => {
  try {
    const userUpdateInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
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
    res.json({
      success: "profile data changed successfully.",
      currentuser: req.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.changePassword = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    const user = await User.findById(req.user._id);
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
    return res.status(500).json(err);
  }
};
