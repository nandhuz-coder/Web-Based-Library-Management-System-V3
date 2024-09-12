/**
 * @module booksController
 * @description Controller for handling book-related operations.
 */

const mongoose = require("mongoose");

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
 * 1. Check if the user is logged in and set the IsUser flag.
 * 2. Extract book_id from request parameters.
 * 3. Validate if book_id is a valid Mongoose ObjectId.
 * 4. Fetch book details from the database, including comments.
 * 5. Check if the book exists.
 * 6. Send JSON response with book details, user details, and IsUser flag.
 * 7. Handle errors by logging them and sending appropriate error responses.
 */
exports.getBookDetails = async (req, res) => {
  try {
    // Step 1: Check if the user is logged in and set the IsUser flag
    let IsUser = false;
    if (req.user) IsUser = true;

    // Step 2: Extract book_id from request parameters
    const book_id = req.params.bookid;

    // Step 3: Validate if book_id is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(book_id)) {
      return res.json({ error: "Invalid book ID", IsUser: IsUser });
    }

    // Step 4: Fetch book details from the database, including comments
    const book = await Book.findById(book_id).populate("comments");

    // Step 5: Check if the book exists
    if (!book) {
      return res.json({ error: "Book not found", IsUser: IsUser });
    }

    // Step 6: Send JSON response with book details, user details, and IsUser flag
    return res.json({ book: book, user: req.user, IsUser: IsUser });
  } catch (err) {
    // Step 7: Handle errors by logging them and sending appropriate error responses
    console.log(err);
    return res.json({ error: "Internal server error" });
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
