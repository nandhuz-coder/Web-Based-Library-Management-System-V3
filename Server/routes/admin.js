const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware");

// importing controller
const adminController = require("../controllers/admin");

//admin -> dashboard
router.get("/admin/:page", middleware.isAdmin, adminController.getDashboard);

//admin -> delete profile
router.delete(
  "/admin/delete-profile",
  middleware.isAdmin,
  adminController.deleteAdminProfile
);

router.get(
  "/admin/bookInventory/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getInventory
);

//admin -> show books to be updated
router.get(
  "/admin/book/update/:book_id",
  middleware.isAdmin,
  adminController.getUpdateBook
);

//admin -> users list
router.get(
  "/admin/users/:page",
  middleware.isAdmin,
  adminController.getUserList
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
  "/admin/bookstock/out/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminStock
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
