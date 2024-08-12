// importing modules
const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware");

// importing controller
const userController = require("../controllers/user");

// user -> profile
router.get(
  "/user/2/profile",
  middleware.isLoggedIn,
  userController.getUserProfile
);

//user -> show return-renew page
router.get(
  "/user/books/1/return-renew",
  middleware.isLoggedIn,
  userController.getShowRenewReturn
);

//user -> create new comment
router.post(
  "/books/details/:book_id/comment",
  middleware.isLoggedIn,
  userController.postNewComment
);

//user -> update existing comment
router.post(
  "/books/details/:book_id/:comment_id",
  middleware.isLoggedIn,
  userController.postUpdateComment
);

//user -> delete existing comment
router.delete(
  "/books/details/:book_id/:comment_id",
  middleware.isLoggedIn,
  userController.deleteComment
);

module.exports = router;
