// importing modules
const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware");

// importing controller
const userController = require("../controllers/user");

// user -> profile
router.get(
  "/user/:page/profile",
  middleware.isLoggedIn,
  userController.getUserProfile
);

//user -> upload image
router.post(
  "/user/1/image",
  middleware.isLoggedIn,
  userController.postUploadUserImage
);

//user -> update password
router.put(
  "/user/1/update-password",
  middleware.isLoggedIn,
  userController.putUpdatePassword
);

//user -> update profile
router.put(
  "/user/1/update-profile",
  middleware.isLoggedIn,
  userController.putUpdateUserProfile
);

//user -> notification
router.get(
  "/user/1/notification",
  middleware.isLoggedIn,
  userController.getNotification
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

// user -> delete user account
router.delete(
  "/user/1/delete-profile",
  middleware.isLoggedIn,
  userController.deleteUserAccount
);

module.exports = router;
