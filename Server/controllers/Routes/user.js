/**
 * This module contains the controller functions for the user routes.
 * @module userController
 * @description Controller for handling user-related operations.
 */

// importing models
const Issue = require("../../models/issue");

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

