/**
 * @file users.js
 * @router /user
 * @description This file defines the routes for user operations.
 * @module middleware needed for user authentication and authorization
 * @exports router
 */

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

module.exports = router;
