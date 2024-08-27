// importing modules
const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// importing controller
const userController = require("../controllers/Routes/user");

/**
 * @route GET /user/2/profile
 * @description Get user profile
 * @access Private (Logged in users only)
 */
router.get("/2/profile", middleware.isLoggedIn, userController.getUserProfile);

/**
 * @route GET /user/books/1/return-renew
 * @description Show return-renew page
 * @access Private (Logged in users only)
 */
router.get(
  "/books/1/return-renew",
  middleware.isLoggedIn,
  userController.getShowRenewReturn
);

/**
 * @route POST /user/books/details/:book_id/comment
 * @description Create new comment
 * @access Private (Logged in users only)
 */
router.post(
  "/books/details/:book_id/comment",
  middleware.isLoggedIn,
  userController.postNewComment
);

/**
 * @route POST /user/books/details/:book_id/:comment_id
 * @description Update existing comment
 * @access Private (Logged in users only)
 */
router.post(
  "/books/details/:book_id/:comment_id",
  middleware.isLoggedIn,
  userController.postUpdateComment
);

/**
 * @route DELETE /user/books/details/:book_id/:comment_id
 * @description Delete existing comment
 * @access Private (Logged in users only)
 */
router.delete(
  "/books/details/:book_id/:comment_id",
  middleware.isLoggedIn,
  userController.deleteComment
);

module.exports = router;
