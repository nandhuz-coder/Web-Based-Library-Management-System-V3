const express = require("express"),
  router = express.Router(),
  PER_PAGE = 12;

// importing models
const User = require("../models/user"),
  Activity = require("../models/activity"),
  Book = require("../models/book"),
  Issue = require("../models/issue"),
  Comment = require("../models/comment"),
  Request = require("../models/request"),
  Return = require("../models/return");

router.get("/api/global/user", (req, res) => {
  res.json({
    user: req.user,
  });
});

router.get("/api/user/:page", async (req, res) => {
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
});

module.exports = router;
