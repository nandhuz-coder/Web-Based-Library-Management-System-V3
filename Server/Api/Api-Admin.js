const express = require("express");
const router = express.Router();
const adminController = require("../controllers/api/admin");

/**
 * Route to delete a book.
 * @route GET /book/delete/:book_id
 * @param {string} book_id - The ID of the book to delete.
 */
router.get("/book/delete/:book_id", adminController.deleteBook);

/**
 * Route to update a book.
 * @route POST /book/update/:book_id
 * @param {string} book_id - The ID of the book to update.
 */
router.post("/book/update/:book_id", adminController.updateBook);

/**
 * Route to show searched users.
 * @route POST /users/:page
 * @param {number} page - The page number for pagination.
 */
router.post("/users/:page", adminController.showSearchedUser);

/**
 * Route to delete a user.
 * @route GET /users/delete/:user_id
 * @param {string} user_id - The ID of the user to delete.
 */
router.get("/users/delete/:user_id", adminController.deleteUser);

/**
 * Route to flag a user.
 * @route GET /users/flagged/:user_id
 * @param {string} user_id - The ID of the user to flag.
 */
router.get("/users/flagged/:user_id", adminController.flagUser);

/**
 * Route to add a book.
 * @route POST /add/book
 */
router.post("/add/book", adminController.addBook);

/**
 * Route to accept a book request.
 * @route GET /book/request/accept/:id
 * @param {string} id - The ID of the book request to accept.
 */
router.get("/book/request/accept/:id", adminController.acceptBookRequest);

/**
 * Route to decline a book request.
 * @route GET /book/request/decline/:id
 * @param {string} id - The ID of the book request to decline.
 */
router.get("/book/request/decline/:id", adminController.declineBookRequest);

/**
 * Route to accept a book return.
 * @route GET /book/return/accept/:id
 * @param {string} id - The ID of the book return to accept.
 */
router.get("/book/return/accept/:id", adminController.acceptBookReturn);

/**
 * Route to decline a book return.
 * @route GET /book/return/decline/:id
 * @param {string} id - The ID of the book return to decline.
 */
router.get("/book/return/decline/:id", adminController.declineBookReturn);

/**
 * Route to show activities by category.
 * @route POST /users/activities/:id
 * @param {string} id - The ID of the user.
 */
router.post("/users/activities/:id", adminController.showActivitiesByCategory);

/**
 * Route to update the admin profile.
 * @route POST /edit/profile
 */
router.post("/edit/profile", adminController.updateProfile);

/**
 * Route to update the admin password.
 * @route POST /update-password
 */
router.post("/update-password", adminController.updatePassword);

/**
 * Route to delete the admin profile.
 * @route DELETE /delete-profile
 */
router.delete("/delete-profile", adminController.deleteProfile);

/**
 * Route to get mail configurations.
 * @route GET /mails/config
 */
router.get("/mails/config", adminController.getMailsConfig);

/**
 * Route to configure email.
 * @route POST /mails/configure
 */
router.post("/mails/configure", adminController.configureEmail);

/**
 * Route to update mail configurations.
 * @route POST /mails/update
 */
router.post("/mails/update", adminController.updateMailsConfig);

/**
 * Route to delete mails.
 * @route POST /mails/delete
 */
router.post("/mails/delete", adminController.deleteMails);

module.exports = router;
