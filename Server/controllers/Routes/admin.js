// importing dependencies
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// importing models
const Book = require("../../models/book");
const User = require("../../models/user");
const Activity = require("../../models/activity");
const Issue = require("../../models/issue");
const Comment = require("../../models/comment");
const Request = require("../../models/request");
const Return = require("../../models/return");

// GLOBAL_VARIABLES
const PER_PAGE = 10;

/**
 * Retrieves a list of activities for the admin dashboard.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Array>} A promise that resolves to sending a JSON response with user, book, and activity counts, and paginated activities.
 *
 * Workflow:
 * 1. Extract the page number from the request parameters, defaulting to 1 if not provided.
 * 2. Retrieve the count of non-admin users from the User collection.
 * 3. Retrieve the count of books from the Book collection.
 * 4. Retrieve the total count of activities from the Activity collection.
 * 5. Fetch a paginated list of activities, sorted by entry time in descending order.
 * 6. Calculate the total number of pages based on the activity count and items per page.
 * 7. Send a JSON response containing the user count, book count, activities, current page, and total pages.
 * 8. Handle any errors that occur during the process and log them to the console.
 */
exports.getDashboard = async (req, res) => {
  var page = req.params.page || 1;
  try {
    // Step 2: Get the count of non-admin users
    const users_count = await User.find().countDocuments({ isAdmin: false });

    // Step 3: Get the count of books
    const books_count = await Book.find().countDocuments();

    // Step 4: Get the total count of activities
    const activity_count = await Activity.find().countDocuments();

    // Step 5: Fetch paginated activities
    const activities = await Activity.find()
      .sort({ entryTime: -1 })
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE)
      .exec();

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(activity_count / PER_PAGE);

    // Step 7: Send JSON response
    return await res.json({
      users_count: users_count,
      books_count: books_count,
      activities: activities,
      current: page,
      pages: totalPages,
    });
  } catch (err) {
    // Step 8: Handle errors
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the dashboard data." });
  }
};

/**
 * Fetches a chunk of books based on the search criteria.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves to sending a JSON response with the filtered books, current page, total pages, filter, and value.
 *
 * Workflow:
 * 1. Extract the page number from the request parameters, defaulting to 1 if not provided.
 * 2. Extract the filter and value from the request parameters.
 * 3. Construct the search object based on the filter and value.
 * 4. Retrieve the count of books that match the search criteria.
 * 5. Fetch a paginated list of books based on the search criteria.
 * 6. Calculate the total number of pages based on the book count and items per page.
 * 7. Send a JSON response containing the books, current page, total pages, filter, and value.
 * 8. Handle any errors that occur during the process and log them to the console.
 */
exports.getInventory = async (req, res) => {
  try {
    // Step 1: Extract the page number
    let page = req.params.page || 1;

    // Step 2: Extract the filter and value
    const filter = req.params.filter.toLowerCase();
    const value = req.params.value;

    // Step 3: Construct the search object
    let searchObj = {};
    if (filter !== "all" && value !== "all") {
      searchObj[filter] = value;
    }

    // Step 4: Get the book count
    const books_count = await Book.find(searchObj).countDocuments();

    // Step 5: Fetch paginated books
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(books_count / PER_PAGE);

    // Step 7: Send JSON response
    await res.json({
      books: books,
      current: page,
      pages: totalPages,
      filter: filter,
      value: value,
    });
  } catch (err) {
    // Step 8: Handle errors
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the book inventory." });
  }
};

// admin -> get the book to be updated
/**
 * Retrieves a book by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the retrieved book.
 *
 * Workflow:
 * 1. Extract the book ID from the request parameters.
 * 2. Retrieve the book from the database using the book ID.
 * 3. Send a JSON response containing the retrieved book.
 * 4. Handle any errors that occur during the process and log them to the console.
 */
exports.getUpdateBook = async (req, res, _next) => {
  try {
    // Step 1: Extract the book ID from the request parameters
    const book_id = req.params.book_id;

    // Step 2: Retrieve the book from the database using the book ID
    const book = await Book.findById(book_id);

    // Step 3: Send a JSON response containing the retrieved book
    await res.json({
      book: book,
    });
  } catch (err) {
    // Step 4: Handle any errors that occur during the process and log them to the console
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the book." });
  }
};

// admin -> get user list
/**
 * Retrieves a list of users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the list of users.
 * Workflow:
 * 1. Extract the page number from the request parameters, defaulting to 1 if not provided.
 * 2. Retrieve a paginated list of users from the database, sorted by the date they joined in descending order.
 * 3. Retrieve the count of non-admin users from the database.
 * 4. Calculate the total number of pages based on the user count and items per page.
 * 5. Send a JSON response containing the users, current page, and total pages.
 * 6. Handle any errors that occur during the process and log them to the console.
 */
exports.getUserList = async (req, res, _next) => {
  try {
    // Step 1: Extract the page number from the request parameters
    const page = parseInt(req.params.page, 10) || 1;

    // Step 2: Retrieve a paginated list of users from the database
    const users = await User.find()
      .sort("-joined")
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);

    // Step 3: Retrieve the count of non-admin users from the database
    const users_count = await User.find().countDocuments({ isAdmin: false });

    // Step 4: Calculate the total number of pages
    const totalPages = Math.ceil(users_count / PER_PAGE);

    // Step 5: Send a JSON response containing the users, current page, and total pages
    await res.json({
      users: users,
      current: page,
      pages: totalPages,
    });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process and log them to the console
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// admin -> show one user
/**
 * Retrieves activities based on the provided user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the user's profile, issues, comments, and activities.
 *
 * Workflow:
 * 1. Extract the user ID from the request parameters.
 * 2. Validate the user ID format.
 * 3. Retrieve the user from the database using the user ID.
 * 4. If the user is not found, send a JSON response indicating no user was found.
 * 5. Retrieve the user's issues from the database.
 * 6. Retrieve the user's comments from the database.
 * 7. Retrieve the user's activities from the database, sorted by entry time in descending order.
 * 8. Send a JSON response containing the user, issues, comments, and activities.
 * 9. Handle any errors that occur during the process and log them to the console.
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the request parameters
    const user_id = req.params.user_id;

    // Step 2: Validate the user ID format
    if (!ObjectId.isValid(user_id)) {
      return res.json({ error: "Invalid ID format", NoRender: true });
    }

    // Step 3: Retrieve the user from the database using the user ID
    const user = await User.findById(user_id);
    if (!user) {
      // Step 4: If the user is not found, send a JSON response indicating no user was found
      return res.json({ error: "No user found", NoRender: true });
    }

    // Step 5: Retrieve the user's issues from the database
    const issues = await Issue.find({ "user_id.id": user_id });

    // Step 6: Retrieve the user's comments from the database
    const comments = await Comment.find({ "author.id": user_id });

    // Step 7: Retrieve the user's activities from the database, sorted by entry time in descending order
    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );

    // Step 8: Send a JSON response containing the user, issues, comments, and activities
    await res.json({
      user: user,
      issues: issues,
      activities: activities,
      comments: comments,
    });
  } catch (err) {
    // Step 9: Handle any errors that occur during the process and log them to the console
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// admin -> show all activities of one user
/**
 * Retrieves activities based on the given user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} _next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the user's activities.
 *
 * Workflow:
 * 1. Extract the user ID from the request parameters.
 * 2. Validate the user ID format.
 * 3. Retrieve the user's activities from the database, sorted by entry time in descending order.
 * 4. Send a JSON response containing the activities.
 * 5. Handle any errors that occur during the process and log them to the console.
 */
exports.getUserAllActivities = async (req, res, _next) => {
  try {
    // Step 1: Extract the user ID from the request parameters
    const user_id = req.params.user_id;

    // Step 2: Validate the user ID format
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Step 3: Retrieve the user's activities from the database, sorted by entry time in descending order
    const activities = await Activity.find({ "user_id.id": user_id }).sort(
      "-entryTime"
    );

    // Step 4: Send a JSON response containing the activities
    await res.json({
      activities: activities,
    });
  } catch (err) {
    // Step 5: Handle any errors that occur during the process and log them to the console
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// admin -> get profile
/**
 * Retrieves the profile of the currently authenticated admin user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the admin's username and email.
 *
 * Workflow:
 * 1. Extract the username and email from the authenticated user in the request object.
 * 2. Send a JSON response containing the username and email.
 */
exports.getAdminProfile = async (req, res) => {
  try {
    // Step 1: Extract the username and email from the authenticated user in the request object
    const { username, email } = req.user;

    // Step 2: Send a JSON response containing the username and email
    await res.json({ username, email });
  } catch (err) {
    // Handle any errors that occur during the process and log them to the console
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// admin -> get stock out book inventory working procedure
/**
 * Retrieves a list of books based on the search criteria.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the list of books.
 *
 * Workflow:
 * 1. Extract the page number, filter, and value from the request parameters.
 * 2. Construct the search object based on the filter and value.
 * 3. Retrieve the count of books that match the search criteria.
 * 4. Retrieve a paginated list of books that match the search criteria.
 * 5. Send a JSON response containing the books, current page, total pages, filter, and value.
 * 6. Handle any errors that occur during the process and log them to the console.
 */
exports.getAdminStock = async (req, res) => {
  try {
    // Step 1: Extract the page number, filter, and value from the request parameters
    const page = parseInt(req.params.page, 10) || 1;
    const filter = req.params.filter || "all";
    const value = req.params.value || "all";

    // Step 2: Construct the search object based on the filter and value
    let searchObj = { stock: 0 };
    if (filter !== " " && value !== " ") {
      searchObj[filter] = value;
    }

    // Step 3: Retrieve the count of books that match the search criteria
    const books_count = await Book.find(searchObj).countDocuments();

    // Step 4: Retrieve a paginated list of books that match the search criteria
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);

    // Step 5: Send a JSON response containing the books, current page, total pages, filter, and value
    return res.json({
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process and log them to the console
    console.error("Error fetching admin stock:", err);
    return res.status(500).json({
      error: "An error occurred while fetching the stock data.",
    });
  }
};

// admin -> get Request book inventory working procedure
/**
 * Finds requests based on the provided search object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the list of requests.
 *
 * Workflow:
 * 1. Extract the page number, filter, and value from the request parameters.
 * 2. Adjust the filter key if necessary (e.g., for username or book information).
 * 3. Construct the search object based on the filter and value.
 * 4. Retrieve the count of requests that match the search criteria.
 * 5. Retrieve a paginated list of requests that match the search criteria.
 * 6. Send a JSON response containing the requests, current page, total pages, filter, and value.
 * 7. Handle any errors that occur during the process and log them to the console.
 */
exports.getAdminRequest = async (req, res) => {
  try {
    // Step 1: Extract the page number, filter, and value from the request parameters
    let page = parseInt(req.params.page, 10) || 1;
    let filter = req.params.filter || "all";
    const value = req.params.value || "all";

    // Step 2: Adjust the filter key if necessary
    if (filter !== "all") {
      if (filter === "username") {
        filter = "user_id.username";
      } else {
        filter = `book_info.${filter}`;
      }
    }

    // Step 3: Construct the search object based on the filter and value
    let searchObj = {};
    if (filter !== "all" && value !== "all") {
      searchObj[filter] = value;
    }

    // Step 4: Retrieve the count of requests that match the search criteria
    const Request_count = await Request.find(searchObj).countDocuments();

    // Step 5: Retrieve a paginated list of requests that match the search criteria
    const request = await Request.find(searchObj)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE)
      .populate({
        path: "book_info.id",
        select: "stock",
      })
      .exec();

    // Step 6: Send a JSON response containing the requests, current page, total pages, filter, and value
    await res.json({
      books: request,
      current: page,
      pages: Math.ceil(Request_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    // Step 7: Handle any errors that occur during the process and log them to the console
    console.error("Error fetching admin requests:", err.message);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// admin -> get Return book inventory working procedure
/**
 * Finds and returns a list of documents based on the provided search object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the list of return documents.
 *
 * Workflow:
 * 1. Extract the page number, filter, and value from the request parameters.
 * 2. Adjust the filter key if necessary (e.g., for username or book information).
 * 3. Construct the search object based on the filter and value.
 * 4. Retrieve the count of return documents that match the search criteria.
 * 5. Retrieve a paginated list of return documents that match the search criteria.
 * 6. Send a JSON response containing the return documents, current page, total pages, filter, and value.
 * 7. Handle any errors that occur during the process and log them to the console.
 */
exports.getAdminReturn = async (req, res) => {
  try {
    // Step 1: Extract the page number, filter, and value from the request parameters
    let page = parseInt(req.params.page, 10) || 1;
    let filter = req.params.filter || "all";
    const value = req.params.value || "all";

    // Step 2: Adjust the filter key if necessary
    if (filter !== "all") {
      if (filter === "username") {
        filter = "user_id.username";
      } else {
        filter = `book_info.${filter}`;
      }
    }

    // Step 3: Construct the search object based on the filter and value
    let searchObj = {};
    if (filter !== "all" && value !== "all") {
      searchObj[filter] = value;
    }

    // Step 4: Retrieve the count of return documents that match the search criteria
    const returnCount = await Return.find(searchObj).countDocuments();

    // Step 5: Retrieve a paginated list of return documents that match the search criteria
    const returns = await Return.find(searchObj)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);

    // Step 6: Send a JSON response containing the return documents, current page, total pages, filter, and value
    await res.json({
      books: returns,
      current: page,
      pages: Math.ceil(returnCount / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    // Step 7: Handle any errors that occur during the process and log them to the console
    console.error("Error fetching return documents:", err.message);
    return res.status(500).json({ error: "An unknown error occurred." });
  }
};
