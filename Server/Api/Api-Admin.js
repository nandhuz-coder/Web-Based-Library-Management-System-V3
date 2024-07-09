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

//admin -> global & user
router.get("/api/global", middleware.isAdmin, async (req, res, next) => {
  try {
    return res.json({
      global: await global(),
      currentUser: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

//admin -> dashboard
router.get(
  "/api/admin",
  middleware.isAdmin,
  middleware.ifUser,
  async (req, res, next) => {
    var page = req.query.page || 1;
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
  }
);

module.exports = router;
