const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware/index");

// Import index controller
const authController = require("../controllers/auth");

// Admin Login
router.post("/auth/admin-login", function (req, res, next) {
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

router.post(
  "/auth/admin-signup",
  middleware.ifUser,
  authController.postAdminSignUp
);

//user login handler
router.post("/auth/user-login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json({ error: "Please provide Valid Username and password" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.json({ success: `Hello, ${user.username} Welcome` });
    });
  })(req, res, next);
});

//user -> user logout handler
router.get("/auth/1/user-logout", authController.getUserLogout);

//usser -> user signup post
router.post(
  "/auth/user-signup",
  middleware.ifUser,
  authController.postUserSignUp
);

module.exports = router;
