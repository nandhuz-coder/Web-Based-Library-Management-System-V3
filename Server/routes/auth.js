const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware/index");

// Import index controller
const authController = require("../controllers/auth");

// Import models
const User = require("../models/user");

//landing page
router.get("/", middleware.ifUser, authController.getLandingPage);

//admin login handler
router.get(
  "/auth/admin-login",
  middleware.ifUser,
  authController.getAdminLoginPage
);

router.post("/auth/admin-login", middleware.ifUser, function (req, res, next) {
  try {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return res.json({ error: "try after some times." });
      }
      if (!user) {
        return res.json({ error: "Invalid username or password" });
      }
      req.logIn(user, async function (err) {
        if (err) {
          return res.json({ error: "unknown error" });
        } else {
          return res.json({
            success: "Hello, " + user.username + " Welcome",
            user,
          });
        }
      });
    })(req, res, next);
  } catch (error) {
    console.log(error);
  }
});

//admin logout handler
router.post("/auth/admin-logout", authController.getAdminLogout);

// admin sign up handler
router.get(
  "/auth/admin-signup",
  middleware.ifUser,
  authController.getAdminSignUp
);

router.post(
  "/auth/admin-signup",
  middleware.ifUser,
  authController.postAdminSignUp
);

//user login handler
router.get(
  "/auth/user-login",
  middleware.ifUser,
  authController.getUserLoginPage
);

router.post("/auth/user-login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "Please provide Valid Username and password");
      return res.redirect("/auth/user-login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Hello, " + user.username + " Welcome");
      res.redirect("/user/1");
    });
  })(req, res, next);
});

//user -> user logout handler
router.get("/auth/user-logout", authController.getUserLogout);

//user sign up handler
router.get(
  "/auth/user-signUp",
  middleware.ifUser,
  authController.getUserSignUp
);

router.post(
  "/auth/user-signup",
  middleware.ifUser,
  authController.postUserSignUp
);

module.exports = router;
