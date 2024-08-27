/**
 * @file middleware.js is responsible for user authentication and authorization fetching using api calls.
 * @module middleware
 * @description This file defines middleware functions for user authentication and authorization.
 */

const express = require("express");
const router = express.Router();

/**
 * @route GET /middleware/checkUserType
 * @desc Check the type of the authenticated user (admin or regular user)
 * @access Public
 *
 * This endpoint checks if the user is authenticated and determines their type.
 * If the user is authenticated and is an admin, it returns { isAdmin: true }.
 * If the user is authenticated and is a regular user, it returns { isUser: true }.
 * If the user is not authenticated, it returns { isUser: false }.
 */
router.get("/checkUserType", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.json({ isAdmin: true });
    } else {
      return res.json({ isUser: true });
    }
  } else {
    return res.json({ isUser: false });
  }
});

/**
 * @route GET /middleware/ifadmin
 * @desc Check if the user is an admin
 * @access Public
 *
 * This endpoint checks if the user is authenticated and is an admin.
 * If the user is an admin, it returns { isAdmin: true }.
 * If the user is not an admin, it returns { isAdmin: false }.
 */
router.get("/ifuser", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.json({ isAdmin: true });
    } else {
      return res.json({ isAdmin: false });
    }
  } else {
    return res.json({ isUser: false });
  }
});

module.exports = router;
