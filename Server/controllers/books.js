const Book = require("../models/book");
const PER_PAGE = 12;

exports.findBooks = async (req, res, next) => {
  var page = req.params.page || 1;
  const filter = req.body.filter.toLowerCase();
  const value = req.body.searchName;

  // show flash message if empty search field is sent to backend
  if (value == "") {
    return res.json({
      error:
        "Search field is empty. Please fill the search field in order to get a result",
    });
  }
  const searchObj = {};
  searchObj[filter] = value;
  try {
    // Fetch books from database
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // Get the count of total available book of given filter
    const count = await Book.find(searchObj).countDocuments();

    if (count == 0) {
      return res.json({
        error: "There are No such Books in the Library. Try Again",
      });
    } else {
      return res.json({
        books: books,
        current: page,
        pages: Math.ceil(count / PER_PAGE),
        filter: filter,
        value: value,
        user: req.user,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getBookDetails = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id).populate("comments");
    res.render("user/bookDetails", { book: book });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
