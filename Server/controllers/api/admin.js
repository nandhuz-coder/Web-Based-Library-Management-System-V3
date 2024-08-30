/**
 * @module adminController
 * @description This module handles the admin operations.
 */

// Importing required models
const Book = require("../../models/book");
const User = require("../../models/user");
const Activity = require("../../models/activity");
const Issue = require("../../models/issue");
const Comment = require("../../models/comment");
const Request = require("../../models/request");
const Return = require("../../models/return");
const MailConfig = require("../../models/mail-config");

//importing utils
const deleteImage = require("../../utils/image/delete_image");
const EmailService = require("../../utils/mail/configure-mails");
const fs = require("fs");

//importing collections
const collection = require("../../utils/handler/collection");

/**
 * Deletes a book from the database.
 *
 * @async
 * @function deleteBook
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.book_id - The ID of the book to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure.
 *
 * @description
 * This function handles the deletion of a book from the database. It performs the following steps:
 * workflow:
 * 1. Extracts the book ID from the request parameters.
 * 2. Finds the book in the database using the book ID.
 * 3. Deletes the book from the database.
 * 4. Sends a JSON response indicating the success of the deletion.
 * 5. If an error occurs, logs the error and sends a JSON response with the error message.
 */
exports.deleteBook = async (req, res) => {
  try {
    // Step 1: Extract the book ID from the request parameters
    const book_id = req.params.book_id;

    // Step 2: Find the book in the database using the book ID
    const book = await Book.findById(book_id);

    // Step 3: Delete the book from the database
    await book.deleteOne();

    // Step 4: Send a JSON response indicating the success of the deletion
    res.json({ success: `A book named ${book.title} is just deleted!` });
  } catch (err) {
    // Step 5: If an error occurs, log the error and send a JSON response with the error message
    console.log(err);
    res.json({ error: err });
  }
};

/**
 * Updates a book's information in the database.
 *
 * @async
 * @function updateBook
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {Object} req.body.book - The new information for the book.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.book_id - The ID of the book to update.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or failure.
 *
 * @description
 * workflow:
 * This function handles updating a book's information in the database. It performs the following steps:
 * 1. Extracts the new book information from the request body.
 * 2. Extracts the book ID from the request parameters.
 * 3. Finds the book in the database using the book ID and updates it with the new information.
 * 4. Sends a JSON response indicating the success of the update.
 * 5. If an error occurs, logs the error and sends a JSON response with an error message.
 */
exports.updateBook = async (req, res) => {
  try {
    // Step 1: Extract the new book information from the request body
    const book_info = req.body.book;

    // Step 2: Extract the book ID from the request parameters
    const book_id = req.params.book_id;

    // Step 3: Find the book in the database using the book ID and update it with the new information
    await Book.findByIdAndUpdate(book_id, book_info);

    // Step 4: Send a JSON response indicating the success of the update
    res.json({ success: "Book updated successfully." });
  } catch (err) {
    // Step 5: If an error occurs, log the error and send a JSON response with an error message
    console.log(err);
    return res.json({ error: "error" });
  }
};

/**
 * Searches for users based on the provided search value.
 *
 * @async
 * @function showSearchedUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.page - The page number for pagination.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.searchUser - The value to search for in user fields.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Returns a JSON response with the search results or an error message.
 *
 * @description
 * workflow:
 * This function handles searching for users in the database based on a search value provided in the request body. It performs the following steps:
 * 1. Extracts the page number from the request parameters, defaulting to 1 if not provided.
 * 2. Extracts the search value from the request body.
 * 3. Searches the database for users whose first name, last name, username, or email matches the search value.
 * 4. If no users are found, sends a JSON response with an error message.
 * 5. If users are found, sends a JSON response with the users, current page, and total pages.
 * 6. If an error occurs, logs the error.
 */
exports.showSearchedUser = async (req, res, next) => {
  try {
    // Step 1: Extract the page number from the request parameters, defaulting to 1 if not provided
    const page = req.params.page || 1;

    // Step 2: Extract the search value from the request body
    const search_value = req.body.searchUser;

    // Step 3: Search the database for users whose first name, last name, username, or email matches the search value
    const users = await User.find({
      $or: [
        { firstName: search_value },
        { lastName: search_value },
        { username: search_value },
        { email: search_value },
      ],
    });

    // Step 4: If no users are found, send a JSON response with an error message
    if (users.length <= 0) {
      return res.json({ error: "User not found!" });
    } else {
      // Step 5: If users are found, send a JSON response with the users, current page, and total pages
      await res.json({
        users: users,
        current: page,
        pages: 0, // Assuming pagination is not implemented yet
      });
    }
  } catch (err) {
    // Step 6: If an error occurs, log the error
    console.log(err);
  }
};

/**
 * Deletes a user and associated data from the database.
 *
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.user_id - The ID of the user to be deleted.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the deletion of a user and all associated data from the database. It performs the following steps:
 * 1. Extracts the user ID from the request parameters.
 * 2. Finds the user in the database by ID.
 * 3. Deletes the user from the database.
 * 4. Deletes the user's image file if it exists.
 * 5. Deletes all issues associated with the user.
 * 6. Deletes all comments authored by the user.
 * 7. Deletes all activities associated with the user.
 * 8. Deletes all requests made by the user.
 * 9. Deletes all returns associated with the user.
 * 10. Sends a JSON response indicating the user has been removed.
 * 11. Handles any errors that occur during the process.
 */
exports.deleteUser = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the request parameters
    const user_id = req.params.user_id;

    // Step 2: Find the user in the database by ID
    const user = await User.findById(user_id);

    // Step 3: Delete the user from the database
    await user.deleteOne();

    // Step 4: Delete the user's image file if it exists
    let imagePath = `images/${user.image}`;
    if (fs.existsSync(imagePath)) {
      deleteImage(imagePath);
    }

    // Step 5: Delete all issues associated with the user
    await Issue.deleteMany({ "user_id.id": user_id });

    // Step 6: Delete all comments authored by the user
    await Comment.deleteMany({ "author.id": user_id });

    // Step 7: Delete all activities associated with the user
    await Activity.deleteMany({ "user_id.id": user_id });

    // Step 8: Delete all requests made by the user
    await Request.deleteMany({ "user_id.id": user_id });

    // Step 9: Delete all returns associated with the user
    await Return.deleteMany({ "user_id.id": user_id });

    // Step 10: Send a JSON response indicating the user has been removed
    return res.json({ success: `${user.username} has removed` });
  } catch (err) {
    // Step 11: Handle any errors that occur during the process
    console.log(err);
    return res.json({ error: `unknown error` });
  }
};

/**
 * Flags or unflags a user for violations.
 *
 * @async
 * @function flagUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.user_id - The ID of the user to be flagged or unflagged.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the flagging or unflagging of a user for violations. It performs the following steps:
 * 1. Extracts the user ID from the request parameters.
 * 2. Finds the user in the database by ID.
 * 3. Checks if the user is already flagged for violations.
 * 4. If the user is flagged, unflags the user and saves the changes.
 * 5. If the user is not flagged, flags the user and saves the changes.
 * 6. Sends a JSON response indicating whether the user was flagged or unflagged.
 * 7. Handles any errors that occur during the process.
 */
exports.flagUser = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the request parameters
    const user_id = req.params.user_id;

    // Step 2: Find the user in the database by ID
    const user = await User.findById(user_id);

    // Step 3: Check if the user is already flagged for violations
    if (user.violationFlag) {
      // Step 4: If the user is flagged, unflag the user and save the changes
      user.violationFlag = false;
      await user.save();
      return res.json({
        success: `An user named ${user.firstName} ${user.lastName} is just unflagged!`,
      });
    } else {
      // Step 5: If the user is not flagged, flag the user and save the changes
      user.violationFlag = true;
      await user.save();
      return res.json({
        warning: `An user named ${user.firstName} ${user.lastName} is just flagged!`,
      });
    }
  } catch (err) {
    // Step 7: Handle any errors that occur during the process
    console.log(err);
    return res.json({ error: `unknown error` });
  }
};

/**
 * Adds a new book to the inventory.
 *
 * @async
 * @function addBook
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {Object} req.body.book - Book information to be added.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the addition of a new book to the inventory. It performs the following steps:
 * 1. Extracts the book information from the request body.
 * 2. Checks if the book already exists in the inventory.
 * 3. If the book exists, sends a JSON response indicating a duplicate error.
 * 4. If the book does not exist, creates a new book entry and saves it to the database.
 * 5. Sends a JSON response indicating the successful addition of the book.
 * 6. Handles any errors that occur during the process.
 */
exports.addBook = async (req, res) => {
  try {
    // Step 1: Extract the book information from the request body
    const book_info = req.body.book;

    // Step 2: Check if the book already exists in the inventory
    const isDuplicate = await Book.find(book_info);

    // Step 3: If the book exists, send a JSON response indicating a duplicate error
    if (isDuplicate.length > 0) {
      return res.json({
        error: "This book is already registered in inventory",
      });
    }

    // Step 4: If the book does not exist, create a new book entry and save it to the database
    const new_book = new Book(book_info);
    await new_book.save();

    // Step 5: Send a JSON response indicating the successful addition of the book
    return res.json({
      success: `A new book named ${new_book.title} is added to the inventory`,
    });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process
    console.log(err);
    return res.json({ error: `unknown error` });
  }
};

/**
 * Accepts a book request and issues the book to the user.
 *
 * @async
 * @function acceptBookRequest
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the book request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the acceptance of a book request and the issuance of the book to the user. It performs the following steps:
 * 1. Retrieves the book request, user, and book information from the database.
 * 2. Checks if the user has any violations or has reached the maximum number of issued books.
 * 3. Checks if the book is in stock.
 * 4. If all checks pass, registers the book issue, updates the book stock, and logs the activity.
 * 5. Clears the book request and updates the user's book request information.
 * 6. Saves all changes to the database and sends a JSON response indicating success.
 * 7. Handles any errors that occur during the process.
 */
exports.acceptBookRequest = async (req, res) => {
  try {
    // Step 1: Retrieve the book request, user, and book information from the database
    const request = await Request.findById(req.params.id);
    const user = await User.findById(request.user_id.id);
    const book = await Book.findById(request.book_info.id);

    // Step 2: Check if the user has any violations or has reached the maximum number of issued books
    if (user.violationFlag) {
      return res.json({
        error:
          "User is flagged for violating rules/delay on returning books/paying fines. Until the flag is lifted, you can't issue any books.",
      });
    }

    if (user.bookIssueInfo.length >= 5) {
      return res.json({
        error: "You can't issue more than 5 books at a time.",
      });
    }

    // Step 3: Check if the book is in stock
    if (book.stock <= 0) {
      return res.json({ error: "Book is not in stock." });
    }

    // Step 4: Register the book issue, update the book stock, and log the activity
    book.stock -= 1;
    const issue = new Issue({
      book_info: {
        id: book._id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        category: book.category,
        stock: book.stock,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // Step 5: Clear the book request and update the user's book request information
    await user.bookIssueInfo.push(book._id);
    await Request.findByIdAndDelete(req.params.id);
    user.bookRequestInfo.pull({ _id: request.book_info.id });

    // Step 6: Log the activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Issue",
      time: {
        id: issue._id,
        issueDate: issue.book_info.issueDate,
        returnDate: issue.book_info.returnDate,
      },
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // Step 7: Save all changes to the database and send a JSON response indicating success
    await issue.save();
    await user.save();
    await book.save();
    await activity.save();
    res.json({ success: `${book.title} has been issued to ${user.username}` });
  } catch (err) {
    // Step 8: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: `Unknown error` });
  }
};

/**
 * Declines a book request.
 *
 * @async
 * @function declineBookRequest
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the book request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the decline of a book request. It performs the following steps:
 * 1. Retrieves the book request and user information from the database.
 * 2. Logs the decline activity.
 * 3. Clears the book request from the database and updates the user's book request information.
 * 4. Saves all changes to the database and sends a JSON response indicating success.
 * 5. Handles any errors that occur during the process.
 */
exports.declineBookRequest = async (req, res) => {
  try {
    // Step 1: Retrieve the book request and user information from the database
    const request = await Request.findById(req.params.id);
    const user = await User.findById(request.user_id.id);

    // Step 2: Log the decline activity
    const activity = new Activity({
      info: {
        id: request._id,
        title: request.book_info.title,
      },
      category: "Decline",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // Step 3: Clear the book request from the database and update the user's book request information
    await Request.findByIdAndDelete(req.params.id);
    user.bookRequestInfo.pull({ _id: request.book_info.id });

    // Step 4: Save all changes to the database and send a JSON response indicating success
    await user.save();
    await activity.save();
    res.json({ error: `book request has been declined...` });
  } catch (err) {
    // Step 5: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: `unknown error` });
  }
};

/**
 * Accepts a book return request.
 *
 * @async
 * @function acceptBookReturn
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the return request.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the acceptance of a book return request. It performs the following steps:
 * 1. Retrieves the return request, user, book, and issue information from the database.
 * 2. Removes the book object ID from the user's return and issue information.
 * 3. Deletes the issue and return documents from the database.
 * 4. Increments the book stock.
 * 5. Logs the return activity.
 * 6. Saves all changes to the database and sends a JSON response indicating success.
 * 7. Handles any errors that occur during the process.
 */
exports.acceptBookReturn = async (req, res, next) => {
  try {
    // Step 1: Retrieve the return request, user, book, and issue information from the database
    const request = await Return.findById(req.params.id);
    const user = await User.findById(request.user_id.id);
    const book = await Book.findById(request.book_info.id);
    const issue = await Issue.findOne({
      "user_id.id": request.user_id.id,
      "book_info.id": request.book_info.id,
    });

    // Step 2: Remove the book object ID from the user's return and issue information
    await user.bookReturnInfo.pull(book._id);
    await user.bookIssueInfo.pull(book._id);

    // Step 3: Delete the issue and return documents from the database
    await issue.deleteOne();
    await request.deleteOne();

    // Step 4: Increment the book stock
    book.stock++;

    // Step 5: Log the return activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Return",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // Step 6: Save all changes to the database and send a JSON response indicating success
    await user.save();
    await book.save();
    await activity.save();

    // Step 7: Redirect with a success message
    res.json({ success: "Request has been accepted" });
  } catch (err) {
    // Step 8: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: "unknown error" });
  }
};

/**
 * Declines a book return request.
 *
 * @async
 * @function declineBookReturn
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the return request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function handles the decline of a book return request. It performs the following steps:
 * 1. Retrieves the return request, user, book, and issue information from the database.
 * 2. Removes the book object ID from the user's return information.
 * 3. Updates the issue document to mark the book as not returned.
 * 4. Deletes the return request document from the database.
 * 5. Logs the return decline activity.
 * 6. Saves all changes to the database and sends a JSON response indicating success.
 * 7. Handles any errors that occur during the process.
 */
exports.declineBookReturn = async (req, res) => {
  try {
    // Step 1: Retrieve the return request, user, book, and issue information from the database
    const request = await Return.findById(req.params.id);
    const user = await User.findById(request.user_id.id);
    const book = await Book.findById(request.book_info.id);
    const issue = await Issue.findOne({
      "user_id.id": request.user_id.id,
      "book_info.id": request.book_info.id,
    });

    // Step 2: Remove the book object ID from the user's return information
    await user.bookReturnInfo.pull(book._id);

    // Step 3: Update the issue document to mark the book as not returned
    issue.book_info.isReturn = false;

    // Step 4: Delete the return request document from the database
    await request.deleteOne();

    // Step 5: Log the return decline activity
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Return decline",
      user_id: {
        id: user._id,
        username: user.username,
      },
    });

    // Step 6: Save all changes to the database and send a JSON response indicating success
    await user.save();
    await activity.save();
    await issue.save();

    res.json({ error: "Request has been removed" });
  } catch (err) {
    // Step 7: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: "unknown error" });
  }
};

/**
 * Shows activities by category for a specific user.
 *
 * @async
 * @function showActivitiesByCategory
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the user.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.category - Category of activities to filter by.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response with the filtered activities or redirects on error.
 *
 * @description
 * workflow:
 * This function retrieves and returns activities filtered by category for a specific user. It performs the following steps:
 * 1. Extracts the user ID from the request parameters and the category from the request body.
 * 2. Queries the database for activities that match the specified category and user ID.
 * 3. Returns the filtered activities in a JSON response.
 * 4. Handles any errors that occur during the process by logging the error and redirecting back.
 */
exports.showActivitiesByCategory = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the request parameters and the category from the request body
    const user_id = req.params.id;
    const category = req.body.category;

    // Step 2: Query the database for activities that match the specified category and user ID
    const activities = await Activity.find({
      category: category,
      "user_id.id": user_id,
    });

    // Step 3: Return the filtered activities in a JSON response
    return res.json({
      activities: activities,
    });
  } catch (err) {
    // Step 4: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: "An error occurred" });
  }
};

/**
 * Updates the profile of an admin user.
 *
 * @async
 * @function updateProfile
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object.
 * @param {string} req.user._id - ID of the authenticated user.
 * @param {Object} req.body - Request body.
 * @param {Object} req.body.admin - Admin profile information to update.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function updates the profile information of an authenticated admin user. It performs the following steps:
 * 1. Extracts the user ID from the authenticated user object.
 * 2. Extracts the update information from the request body.
 * 3. Updates the user profile in the database with the provided information.
 * 4. Sends a JSON response indicating success.
 * 5. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.updateProfile = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the authenticated user object
    const user_id = req.user._id;

    // Step 2: Extract the update information from the request body
    const update_info = req.body.admin;

    // Step 3: Update the user profile in the database with the provided information
    await User.findByIdAndUpdate(user_id, update_info);

    // Step 4: Send a JSON response indicating success
    res.json({ success: "Successfully edited admin." });
  } catch (err) {
    // Step 5: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: "error editing admin." });
  }
};

/**
 * Updates the password of an admin user.
 *
 * @async
 * @function updatePassword
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object.
 * @param {string} req.user._id - ID of the authenticated user.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.oldPassword - Current password of the user.
 * @param {string} req.body.newPassword - New password to be set.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function updates the password of an authenticated admin user. It performs the following steps:
 * 1. Extracts the user ID from the authenticated user object.
 * 2. Extracts the old and new passwords from the request body.
 * 3. Retrieves the user from the database using the user ID.
 * 4. Changes the user's password using the provided old and new passwords.
 * 5. Saves the updated user information to the database.
 * 6. Sends a JSON response indicating success.
 * 7. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.updatePassword = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the authenticated user object
    const user_id = req.user._id;

    // Step 2: Extract the old and new passwords from the request body
    const old_password = req.body.oldPassword;
    const new_password = req.body.newPassword;

    // Step 3: Retrieve the user from the database using the user ID
    const admin = await User.findById(user_id);

    // Step 4: Change the user's password using the provided old and new passwords
    await admin.changePassword(old_password, new_password);

    // Step 5: Save the updated user information to the database
    await admin.save();

    // Step 6: Send a JSON response indicating success
    res.json({ success: "Successfully changed password." });
  } catch (err) {
    // Step 7: Handle any errors that occur during the process
    console.log(err);
    res.json({ error: "failed changing password." });
  }
};

/**
 * Deletes the profile of an admin user.
 *
 * @async
 * @function deleteProfile
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object.
 * @param {string} req.user._id - ID of the authenticated user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function deletes the profile of an authenticated admin user. It performs the following steps:
 * 1. Extracts the user ID from the authenticated user object.
 * 2. Deletes the user profile from the database using the user ID.
 * 3. Sends a JSON response indicating success.
 * 4. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.deleteProfile = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the authenticated user object
    const user_id = req.user._id;

    // Step 2: Delete the user profile from the database using the user ID
    await User.findByIdAndRemove(user_id);

    // Step 3: Send a JSON response indicating success
    res.json(true);
  } catch (err) {
    // Step 4: Handle any errors that occur during the process
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * Retrieves the mail configuration settings.
 *
 * @async
 * @function getMailsConfig
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response with the mail configuration settings.
 *
 * @description
 * workflow:
 * This function retrieves the mail configuration settings from the in-memory collection. It performs the following steps:
 * 1. Retrieves the mail configuration settings from the collection.mails Map.
 * 2. Sends the retrieved mail configuration settings as a JSON response.
 * 3. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.getMailsConfig = async (req, res) => {
  try {
    // Step 1: Retrieve the mail configuration settings from the collection.mails Map
    const mails = collection.mails.get(0) || [];

    // Step 2: Ensure mails is an array and send the retrieved mail configuration settings as a JSON response
    res.json(Array.isArray(mails) ? mails : [mails]);
  } catch (err) {
    // Step 3: Handle any errors that occur during the process
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to retrieve mail configuration settings." });
  }
};

/**
 * Configures the email settings for the admin user.
 *
 * @async
 * @function configureEmail
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.email - Email address to be configured.
 * @param {string} req.body.authKey - Authentication key for the email service.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function configures the email settings for the admin user. It performs the following steps:
 * 1. Extracts the email and authentication key from the request body.
 * 2. Initializes the email service with the provided email and authentication key.
 * 3. Sends a test email to verify the configuration.
 * 4. Sends a JSON response indicating success and the result of the test email.
 * 5. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.configureEmail = async (req, res) => {
  // Step 1: Extract the email and authentication key from the request body
  const { email, authKey } = req.body;

  // Step 2: Initialize the email service with the provided email and authentication key
  const emailService = new EmailService();
  try {
    emailService.initializeTransporter(email, authKey);

    // Step 3: Send a test email to verify the configuration
    const result = await emailService.VerifyMail(email);

    // Step 4: Send a JSON response indicating success and the result of the test email
    res.json({ success: "Gmail added successfully", ...result });
  } catch (error) {
    // Step 5: Handle any errors that occur during the process
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates the mail configuration settings.
 *
 * @async
 * @function updateMailsConfig
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {Object} req.body.toggles - Toggle settings for the mail configuration.
 * @param {Object} req.body.selections - Selection settings for the mail configuration.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function updates the mail configuration settings. It performs the following steps:
 * 1. Extracts the toggle and selection settings from the request body.
 * 2. Validates the presence of the toggle and selection settings.
 * 3. Retrieves the current mail configuration from the database.
 * 4. Updates the mail configuration with the new toggle and selection settings.
 * 5. Saves the updated configuration to the database.
 * 6. Sends a JSON response indicating success.
 * 7. Handles any errors that occur during the process by logging the error and sending a JSON response with an error message.
 */
exports.updateMailsConfig = async (req, res) => {
  try {
    // Step 1: Extract the toggle and selection settings from the request body
    const { toggles, selections } = req.body;

    // Step 2: Validate the presence of the toggle and selection settings
    if (!toggles || !selections) {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    // Step 3: Retrieve the current mail configuration from the database
    const config = await MailConfig.findOne();
    if (!config) {
      return res.status(404).json({ error: "No config found." });
    }

    // Step 4: Update the mail configuration with the new toggle and selection settings
    config.updateToggles(toggles, selections);

    // Step 5: Save the updated configuration to the database
    await config.save();

    // Step 6: Send a JSON response indicating success
    res.status(200).json({ success: "Configuration successfully updated." });
  } catch (error) {
    // Step 7: Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

/**
 * Deletes an email from the mail configuration and updates the toggles.
 *
 * @async
 * @function deleteMails
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.email - Email address to be deleted.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a JSON response indicating success or error.
 *
 * @description
 * workflow:
 * This function deletes an email from the mail configuration and updates the toggles. It performs the following steps:
 * 1. Extracts the email from the request body.
 * 2. Validates the email. If the email is not provided, it sends a 400 status response with an error message.
 * 3. Retrieves the mail configuration from the database.
 * 4. Validates the mail configuration. If no configuration is found, it sends a 404 status response with an error message.
 * 5. Deletes the email and updates the toggles in the mail configuration.
 * 6. Saves the updated mail configuration to the database.
 * 7. Sends a 200 status response indicating success.
 * 8. Handles any errors that occur during the process by logging the error and sending a 500 status response with an error message.
 */
exports.deleteMails = async (req, res) => {
  try {
    // Step 1: Extract the email from the request body
    const { email } = req.body;

    // Step 2: Validate the email
    if (!email) {
      return res.status(400).json({ error: "Invalid email provided." });
    }

    // Step 3: Retrieve the mail configuration from the database
    const config = await MailConfig.findOne();

    // Step 4: Validate the mail configuration
    if (!config) {
      return res.status(404).json({ error: "No config found." });
    }

    // Step 5: Delete the email and update the toggles in the mail configuration
    config.deleteMailAndUpdateToggles(email);

    // Step 6: Save the updated mail configuration to the database
    await config.save();

    // Step 7: Send a 200 status response indicating success
    res
      .status(200)
      .json({ success: "Mail deleted and configuration updated." });
  } catch (error) {
    // Step 8: Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};
