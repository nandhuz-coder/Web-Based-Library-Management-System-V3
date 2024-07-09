const multer = require("multer");

const middleware = {};

middleware.isLoggedIn = function (req, res, next) {
  return next();
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in first");
  res.redirect("/");
};

middleware.isAdmin = function (req, res, next) {
  return next();
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.json("error", "Sorry, this route is allowed for admin only");
};

middleware.upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

middleware.ifUser = (req, res, next) => {
  return next();
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.json({
        redirect: "/admin",
      });
    }
    return res.json({ redirect: "/user" });
  } else {
    return res.json({ redirect: "/" });
  }
};

module.exports = middleware;
