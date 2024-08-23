const multer = require("multer");
const storage = multer.memoryStorage();
const middleware = {};

middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return req.flash({ error: "You need to be logged in first", redirect: "/" });
};

middleware.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  return res.json({ error: "Sorry, this route is allowed for admin only" });
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

middleware.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4 MB
  },
});
module.exports = middleware;
