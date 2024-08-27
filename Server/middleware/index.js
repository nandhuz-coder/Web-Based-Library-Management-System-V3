/**
 * Middleware module.
 * @file index.js is responsible for user authentication and authorization
 * @module middleware
 * @description Middleware for handling user authentication and authorization.
 */

const multer = require("multer");
const storage = multer.memoryStorage();
const middleware = {};

/**
 * Middleware to check if the user is logged in.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - JSON response if not authenticated.
 */
middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.json({ error: "You need to be logged in first" });
};

/**
 * Middleware to check if the user is an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - JSON response if not an admin.
 */
middleware.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  return res.json({
    error: "Sorry, this route is allowed for admin only",
  });
};

// Configure multer to use memory storage
const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**
 * Middleware to handle file uploads using multer.
 */
middleware.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4 MB
  },
});

module.exports = middleware;
