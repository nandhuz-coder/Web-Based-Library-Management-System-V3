const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware");

// importing controller
const adminController = require("../controllers/admin");

//admin -> dashboard
router.get("/admin/:page", middleware.isAdmin, adminController.getDashboard);

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
  "/admin/1/users/profile/:user_id",
  middleware.isAdmin,
  adminController.getUserProfile
);

//admin -> show all activities of one user
router.get(
  "/admin/1/users/activities/:user_id",
  middleware.isAdmin,
  adminController.getUserAllActivities
);

//admin -> profile
router.get(
  "/admin/2/profile",
  middleware.isAdmin,
  adminController.getAdminProfile
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

// admin -> show return request books
router.get(
  "/admin/bookReturn/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminReturn
);

// //admin -> notifications
// router.get("/admin/notifications", (req, res) => {
//    res.send("This route is still under development. will be added in next version");
// });

module.exports = router;
