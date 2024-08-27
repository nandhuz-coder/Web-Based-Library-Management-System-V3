// importing models
const Activity = require("../../models/activity");
const Book = require("../../models/book");
const Issue = require("../../models/issue");
const Comment = require("../../models/comment");
// user -> profile
/**
 * Retrieves the profile of the currently authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Sends a JSON response with the current user's profile.
 *
 * Workflow:
 * 1. Extract the user object from the request.
 * 2. Send a JSON response containing the current user's profile.
 */
exports.getUserProfile = (req, res, _next) => {
  try {
    // Step 1: Extract the user object from the request
    const user = req.user;

    // Step 2: Send a JSON response containing the current user's profile
    res.json({ currentuser: user });
  } catch (err) {
    // Handle any errors that occur during the process and log them to the console
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

// user -> show return-renew page
/**
 * Retrieves the return and renew information for the currently authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response with the user's issue information.
 *
 * Workflow:
 * 1. Extract the user ID from the authenticated user in the request object.
 * 2. Retrieve the issue information for the user from the database.
 * 3. Send a JSON response containing the issue information and the current user's profile.
 * 4. Handle any errors that occur during the process and log them to the console.
 */
exports.getShowRenewReturn = async (req, res) => {
  try {
    // Step 1: Extract the user ID from the authenticated user in the request object
    const user_id = req.user._id;

    // Step 2: Retrieve the issue information for the user from the database
    const issue = await Issue.find({ "user_id.id": user_id });

    // Step 3: Send a JSON response containing the issue information and the current user's profile
    res.json({ user: issue, currentUser: req.user });
  } catch (err) {
    // Step 4: Handle any errors that occur during the process and log them to the console
    console.error("Error fetching return-renew information:", err);
    res.status(500).json({ error: "An unknown error occurred." });
  }
};

//! user -> create new comment working procedure
/**
 * Creates a new comment for a book and logs the activity.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response indicating success or failure.
 *
 * Workflow:
 * 1. Extract the comment text, user ID, and username from the request.
 * 2. Fetch the book to be commented on by its ID.
 * 3. Create a new Comment instance and fill in the information.
 * 4. Save the comment to the database.
 * 5. Push the comment ID to the book's comments array and save the book.
 * 6. Log the activity by creating a new Activity instance and saving it to the database.
 * 7. Send a JSON response indicating success.
 * 8. Handle any errors that occur during the process and log them to the console.
 */
exports.postNewComment = async (req, res) => {
  try {
    // Step 1: Extract the comment text, user ID, and username from the request
    const comment_text = req.body.comment;
    const user_id = req.user._id;
    const username = req.user.username;

    // Step 2: Fetch the book to be commented on by its ID
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);

    // Step 3: Create a new Comment instance and fill in the information
    const comment = new Comment({
      text: comment_text,
      author: {
        id: user_id,
        username: username,
      },
      book: {
        id: book._id,
        title: book.title,
      },
    });

    // Step 4: Save the comment to the database
    await comment.save();

    // Step 5: Push the comment ID to the book's comments array and save the book
    book.comments.push(comment._id);
    await book.save();

    // Step 6: Log the activity by creating a new Activity instance and saving it to the database
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // Step 7: Send a JSON response indicating success
    res.json({ success: "Comment added successfully" });
  } catch (err) {
    // Step 8: Handle any errors that occur during the process and log them to the console
    console.error("Error adding comment:", err);
    return res.json({ error: "Failed to add comment" });
  }
};

// user -> update existing comment working procedure
/**
 * Updates an existing comment and logs the activity.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response indicating success or failure.
 *
 * Workflow:
 * 1. Extract the comment ID, comment text, book ID, username, and user ID from the request.
 * 2. Fetch the comment to be updated from the database and update it.
 * 3. Fetch the book to be commented on for logging the book ID and title in the activity.
 * 4. Log the activity by creating a new Activity instance and saving it to the database.
 * 5. Send a JSON response indicating success.
 * 6. Handle any errors that occur during the process and log them to the console.
 */
exports.postUpdateComment = async (req, res, _next) => {
  try {
    // Step 1: Extract the comment ID, comment text, book ID, username, and user ID from the request
    const comment_id = req.params.comment_id;
    const comment_text = req.body.comment;
    const book_id = req.params.book_id;
    const username = req.user.username;
    const user_id = req.user._id;

    // Step 2: Fetch the comment to be updated from the database and update it
    await Comment.findByIdAndUpdate(comment_id, { text: comment_text });

    // Step 3: Fetch the book to be commented on for logging the book ID and title in the activity
    const book = await Book.findById(book_id);

    // Step 4: Log the activity by creating a new Activity instance and saving it to the database
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Update Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // Step 5: Send a JSON response indicating success
    res.json({ success: "Comment updated successfully" });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process and log them to the console
    console.error("Error updating comment:", err);
    return res.json({ error: "Failed to update comment" });
  }
};

// user -> delete existing comment working procedure
/**
 * Deletes an existing comment and logs the activity.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to sending a JSON response indicating success or failure.
 *
 * Workflow:
 * 1. Extract the book ID, comment ID, user ID, and username from the request.
 * 2. Fetch the book information for logging purposes.
 * 3. Find the position of the comment ID in the book's comments array and remove it.
 * 4. Find the comment by its ID and remove it from the Comment collection.
 * 5. Log the activity by creating a new Activity instance and saving it to the database.
 * 6. Send a JSON response indicating success.
 * 7. Handle any errors that occur during the process and log them to the console.
 */
exports.deleteComment = async (req, res, _next) => {
  try {
    // Step 1: Extract the book ID, comment ID, user ID, and username from the request
    const book_id = req.params.book_id;
    const comment_id = req.params.comment_id;
    const user_id = req.user._id;
    const username = req.user.username;

    // Step 2: Fetch the book information for logging purposes
    const book = await Book.findById(book_id);

    // Step 3: Find the position of the comment ID in the book's comments array and remove it
    const pos = book.comments.indexOf(comment_id);
    if (pos > -1) {
      book.comments.splice(pos, 1);
      await book.save();
    }

    // Step 4: Find the comment by its ID and remove it from the Comment collection
    await Comment.findByIdAndDelete(comment_id);

    // Step 5: Log the activity by creating a new Activity instance and saving it to the database
    const activity = new Activity({
      info: {
        id: book._id,
        title: book.title,
      },
      category: "Delete Comment",
      user_id: {
        id: user_id,
        username: username,
      },
    });
    await activity.save();

    // Step 6: Send a JSON response indicating success
    res.json({ success: "Comment deleted successfully" });
  } catch (err) {
    // Step 7: Handle any errors that occur during the process and log them to the console
    console.error("Error deleting comment:", err);
    return res.json({ error: "Failed to delete comment" });
  }
};
