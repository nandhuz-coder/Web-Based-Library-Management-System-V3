/**
 * @api true
 * @todo Add JSDocs
 * @todo need to add some functionality and error handling
 */
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const Request = require("../models/request");
const Book = require("../models/book");
const Return = require("../models/return");

// Function to get the count of documents in each collection
async function global() {
  try {
    const value1 = (await Request.find().countDocuments()) || 0;
    const value2 = (await Book.find().countDocuments({ stock: 0 })) || 0;
    const value3 = (await Return.find().countDocuments()) || 0;
    let value = {
      reqbook: value1,
      stock: value2,
      return: value3,
    };
    return value;
  } catch (error) {
    console.error("Error fetching document counts:", error);
  }
}

router.get("/api/users/suggestions", async (req, res) => {
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

/**
 * Route to get global user information.
 * @route GET /api/global/user
 */
router.get("/api/global/user", (req, res) => {
  res.json({ user: req.user });
});
module.exports = router;
