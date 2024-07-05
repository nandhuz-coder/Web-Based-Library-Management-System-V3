const multer = require("multer");

const middleware = {};

middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in first");
  res.redirect("/");
};

middleware.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash("error", "Sorry, this route is allowed for admin only");
  res.redirect("/");
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
      return res.redirect("/admin/");
    }
    return res.redirect("/user/1");
  }
};
module.exports = middleware;
