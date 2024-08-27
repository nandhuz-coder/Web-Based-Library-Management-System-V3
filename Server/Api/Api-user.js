/**
 * @file Api-user.js is the route file for user related API calls.
 * @api true
 * @router /api/user
 * @description This file defines the routes for user operations.
 * @module userController needed for user operations
 */

const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
const userController = require("../controllers/api/users");

/**
 * Route to get a specific user page by page number.
 * @route GET /:page
 * @param {number} page - The page number for pagination.
 */
router.get("/:page", userController.getUserPage);

/**
 * Route to renew a book by book ID.
 * @route POST /user/books/:book_id/renew
 * @param {string} book_id - The ID of the book to renew.
 */
router.post("/books/:book_id/renew", userController.renewBook);

/**
 * Route to return a book by book ID.
 * @route POST /user/books/return/:id
 * @param {string} id - The ID of the book to return.
 */
router.post("/books/return/:id", userController.returnBook);

/**
 * Route to change user profile image.
 * Uses middleware to handle image upload.
 * @route PUT /changeimage
 */
router.put(
  "/changeimage",
  middleware.upload.single("image"),
  userController.changeImage
);

/**
 * Route to delete user profile.
 * @route DELETE /1/delete
 */
router.delete("/1/delete", userController.deleteProfile);

/**
 * Route to update user profile information.
 * @route POST /profile/edit
 */
router.post("/profile/edit", userController.updateProfile);

/**
 * Route to change user password.
 * @route POST /1/changepassword
 */
router.post("/1/changepassword", userController.changePassword);

module.exports = router;
