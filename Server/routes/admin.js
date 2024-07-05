const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware");

// importing controller
const adminController = require("../controllers/admin");

//admin -> dashboard
router.get("/admin", middleware.isAdmin, adminController.getDashboard);

//admin -> find activities of all users on admin dashboard
router.post("/admin", middleware.isAdmin, adminController.postDashboard);

//admin -> delete profile
router.delete(
  "/admin/delete-profile",
  middleware.isAdmin,
  adminController.deleteAdminProfile
);

//admin book inventory
router.get(
  "/admin/bookInventory/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminBookInventory
);

// admin -> show searched books
router.post(
  "/admin/bookInventory/:filter/:value/:page",
  middleware.isAdmin,
  adminController.postAdminBookInventory
);

//admin -> show books to be updated
router.get(
  "/admin/book/update/:book_id",
  middleware.isAdmin,
  adminController.getUpdateBook
);

//admin -> update book
router.post(
  "/admin/book/update/:book_id",
  middleware.isAdmin,
  adminController.postUpdateBook
);

//admin -> delete book
router.get(
  "/admin/book/delete/:book_id",
  middleware.isAdmin,
  adminController.getDeleteBook
);

//admin -> users list
router.get(
  "/admin/users/:page",
  middleware.isAdmin,
  adminController.getUserList
);

//admin -> show searched user
router.post(
  "/admin/users/:page",
  middleware.isAdmin,
  adminController.postShowSearchedUser
);

//admin -> flag/unflag user
router.get(
  "/admin/users/flagged/:user_id",
  middleware.isAdmin,
  adminController.getFlagUser
);

//admin -> show one user
router.get(
  "/admin/users/profile/:user_id",
  middleware.isAdmin,
  adminController.getUserProfile
);

//admin -> show all activities of one user
router.get(
  "/admin/users/activities/:user_id",
  middleware.isAdmin,
  adminController.getUserAllActivities
);

//admin -> show activities by category
router.post(
  "/admin/users/activities/:user_id",
  middleware.isAdmin,
  adminController.postShowActivitiesByCategory
);

// admin -> delete a user
router.get(
  "/admin/users/delete/:user_id",
  middleware.isAdmin,
  adminController.getDeleteUser
);

//admin -> add new book
router.get(
  "/admin/books/add",
  middleware.isAdmin,
  adminController.getAddNewBook
);

router.post(
  "/admin/books/add",
  middleware.isAdmin,
  adminController.postAddNewBook
);

//admin -> profile
router.get(
  "/admin/profile",
  middleware.isAdmin,
  adminController.getAdminProfile
);

//admin -> update profile
router.post(
  "/admin/profile",
  middleware.isAdmin,
  adminController.postUpdateAdminProfile
);

//admin -> update password
router.post(
  "/admin/update-password",
  middleware.isAdmin,
  adminController.putUpdateAdminPassword
);

//admin book inventory
router.get(
  "/admin/bookStock/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminStock
);

// admin -> show searched books
router.post(
  "/admin/bookStock/:filter/:value/:page",
  middleware.isAdmin,
  adminController.postAdminStock
);

//admin stock out book inventory
router.get(
  "/admin/bookRequest/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminRequest
);

// admin -> show request books
router.post(
  "/admin/bookRequest/:filter/:value/:page",
  middleware.isAdmin,
  adminController.postAdminRequest
);

// admin -> accept request books
router.get(
  "/admin/book/accept/:id",
  middleware.isAdmin,
  adminController.getAcceptRequest
);

// admin -> decline request books
router.get(
  "/admin/book/decline/:id",
  middleware.isAdmin,
  adminController.getDeclineRequest
);

// admin -> show return request books
router.get(
  "/admin/bookReturn/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminReturn
);

// admin -> show request books
router.post(
  "/admin/bookReturn/:filter/:value/:page",
  middleware.isAdmin,
  adminController.postAdminReturn
);

// admin -> accept request books
router.get(
  "/admin/book/return/accept/:id",
  middleware.isAdmin,
  adminController.getAcceptReturn
);

// admin -> decline request books
router.get(
  "/admin/book/return/decline/:id",
  middleware.isAdmin,
  adminController.getDeclineReturn
);

// //admin -> notifications
// router.get("/admin/notifications", (req, res) => {
//    res.send("This route is still under development. will be added in next version");
// });

module.exports = router;
