const express = require("express"),
  router = express.Router(),
  PER_PAGE = 12;
const User = require("../models/user"),
  Activity = require("../models/activity"),
  Book = require("../models/book"),
  Issue = require("../models/issue"),
  Comment = require("../models/comment"),
  Request = require("../models/request"),
  Return = require("../models/return");

// Books -> Books & Pagination
router.get("/api/books/:filter/:value/:page", async (req, res) => {
  var page = req.params.page || 1;
  const filter = req.params.filter;
  const value = req.params.value;
  let searchObj = {};

  // constructing search object
  if (filter != "all" && value != "all") {
    // fetch books by search value and filter
    searchObj[filter] = value;
  }

  try {
    // Fetch books from database
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // Get the count of total available book of given filter
    const count = await Book.find(searchObj).countDocuments();
    return res.json({
      books: books,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});

//Books -> Deatils api
router.get("/api/books/details/:bookid", async (req, res, next) => {
  try {
    const book_id = req.params.bookid;
    const book = await Book.findById(book_id).populate("comments");
    return res.json({ book: book, user: req.user });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
});

router.post(
  "/api/books/:book_id/request/:user_id/:current",
  async (req, res, next) => {
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
      const current = req.params.current;

      if (book.stock == 0) {
        return res.json({ error: "No stock available at this moment." });
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
      return res.json({
        success: `${book.title} is successfully requested.`,
        current: current,
      });
    } catch (err) {
      console.log(err);
      return res.json({ error: "Error submitting request" });
    }
  }
);

module.exports = router;
