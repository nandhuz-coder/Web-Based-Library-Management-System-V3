/**
 * @file auth.js
 * @router /auth
 * @description This file defines the routes for user authentication.
 * @module authController needed for user authentication
 * @module passport needed for user authentication
 * @exports router
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import index controller
const authController = require("../controllers/Routes/auth");

/**
 * @route POST /admin-signup
 * @description Admin signup
 * @access Public
 */
router.post("/admin-signup", authController.postAdminSignUp);

/**
 * @route POST /user-login
 * @description Handles user login
 * @access Public
 *
 * Workflow:
 * 1. The client sends a POST request to /user-login with username and password.
 * 2. The request is handled by the passport.authenticate middleware using the "local" strategy.
 * 3. If an error occurs during authentication, it is passed to the next middleware.
 * 4. If the user is not authenticated (invalid username or password), a JSON response with an error message is sent.
 * 5. If the user is authenticated, req.logIn is called to establish a login session.
 * 6. If an error occurs during login, it is passed to the next middleware.
 * 7. If login is successful, a JSON response with a success message and the username is sent.
 */
router.post("/user-login", function (req, res, next) {
  if (req.user?.session) req.session.destroy();
  // Step 2: Authenticate user credentials
  passport.authenticate("local", function (err, user) {
    if (err) {
      // Step 3: Handle authentication error
      console.log(err);
      return next(err);
    }
    if (!user) {
      // Step 4: Handle invalid username or password
      return res.json({
        error: "Please provide a valid username and password",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        // Step 6: Handle login error
        console.log(err);
        return next(err);
      }
      // Step 7: Send success response
      return res.json({ success: `Hello, ${user.username}. Welcome!` });
    });
  })(req, res, next);
});

/**
 * @route GET /1/user-logout
 * @description User logout handler
 * @access Private
 */
router.get("/1/user-logout", authController.getUserLogout);

/**
 * @route POST /user-signup
 * @description User signup handler
 * @access Public
 */
router.post("/user-signup", authController.postUserSignUp);

module.exports = router;
