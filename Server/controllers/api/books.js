/**
 * @module booksController
 * @description Controller for handling book-related operations.
 */

// Importing required models
const User = require("../../models/user");
const Activity = require("../../models/activity");
const Book = require("../../models/book");
const Request = require("../../models/request");

// global Variables
const PER_PAGE = 12;

/**
 * @function getBooks
 * @description Fetches a paginated list of books based on filter and value.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response with books, pagination info, and user details.
 *
 * Workflow:
 * 1. Extract parameters: page, filter, value from request.
 * 2. Construct search object based on filter and value.
 * 3. Fetch books from the database with pagination.
 * 4. Count total books matching the search criteria.
 * 5. Send JSON response with books, pagination info, filter, value, and user details.
 * 6. Handle errors by logging them.
 */
exports.getBooks = async (req, res) => {
  var page = req.params.page || 1;
  const filter = req.params.filter;
  const value = req.params.value;
  let searchObj = {};

  // Constructing search object
  if (filter != "all" && value != "all") {
    // Fetch books by search value and filter
    searchObj[filter] = value;
  }

  try {
    // Fetch books from database
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // Get the count of total available books of given filter
    const count = await Book.find(searchObj).countDocuments();

    // Send JSON response with books, pagination info, filter, value, and user details
    return res.json({
      books: books,
      current: page,
      pages: Math.ceil(count / PER_PAGE),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    // Handle errors by logging them
    console.log(err);
  }
};

/**
 * @function getBookDetails
 * @description Fetches details of a specific book by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response with book details and user details.
 *
 * Workflow:
 * 1. Extract book_id from request parameters.
 * 2. Fetch book details from the database, including comments.
 * 3. Send JSON response with book details and user details.
 * 4. Handle errors by logging them and redirecting back.
 */
exports.getBookDetails = async (req, res) => {
  try {
    // Extract book_id from request parameters
    const book_id = req.params.bookid;

    // Fetch book details from the database, including comments
    const book = await Book.findById(book_id).populate("comments");

    // Send JSON response with book details and user details
    return res.json({ book: book, user: req.user });
  } catch (err) {
    // Handle errors by logging them and redirecting back
    console.log(err);
    return res.redirect("back");
  }
};

/**
 * @function requestBook
 * @description Handles book request by a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * Workflow:
 * 1. Check if the user has a violation flag. If so, send an error response.
 * 2. Check if the user has already requested 5 books. If so, send an error response.
 * 3. Fetch book and user details from the database.
 * 4. Check if the book is in stock. If not, send an error response.
 * 5. Register the book request and add it to the user's request info.
 * 6. Log the request activity.
 * 7. Save the request, user, book, and activity details to the database.
 * 8. Send JSON response indicating the success of the book request.
 * 9. Handle errors by logging them and sending an error response.
 */
exports.requestBook = async (req, res) => {
  try {
    // Check if the user has a violation flag
    if (req.user.violationFlag) {
      return res.json({
        error:
          "You are flagged for violating rules/delay on returning books/paying fines. Until the flag is lifted, you can't issue any books",
      });
    }

    // Check if the user has already requested 5 books
    if (req.user.bookIssueInfo.length >= 5) {
      return res.json({
        error: "You can't request more than 5 books at a time",
      });
    }

    // Fetch book and user details from the database
    const book = await Book.findById(req.params.book_id);
    const user = await User.findById(req.params.user_id);
    const current = req.params.current;

    // Check if the book is in stock
    if (book.stock == 0) {
      return res.json({ error: "No stock available at this moment." });
    }

    // Register the book request
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

    // Add the request record to the user's document
    user.bookRequestInfo.push(book._id);

    // Log the request activity
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

    // Save the request, user, book, and activity details to the database
    await request.save();
    await user.save();
    await book.save();
    await activity.save();

    // Send JSON response indicating the success of the book request
    return res.json({
      success: `${book.title} is successfully requested.`,
      current: current,
    });
  } catch (err) {
    // Handle errors by logging them and sending an error response
    console.log(err);
    return res.json({ error: "Error submitting request" });
  }
};
