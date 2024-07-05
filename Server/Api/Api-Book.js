const express = require("express"),
  router = express.Router(),
  Book = require("../models/book"),
  PER_PAGE = 12;

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

module.exports = router;
