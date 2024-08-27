const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// importing controller
const adminController = require("../controllers/Routes/admin");

/**
 * @route GET /:page
 * @description Admin dashboard
 * @access Private (Admin only)
 */
router.get("/:page", middleware.isAdmin, adminController.getDashboard);

/**
 * @route GET /bookInventory/:filter/:value/:page
 * @description Get book inventory based on filter and value
 * @access Private (Admin only)
 */
router.get(
  "/bookInventory/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getInventory
);

/**
 * @route GET /book/update/:book_id
 * @description Show books to be updated
 * @access Private (Admin only)
 */
router.get(
  "/book/update/:book_id",
  middleware.isAdmin,
  adminController.getUpdateBook
);

/**
 * @route GET /users/:page
 * @description Get users list
 * @access Private (Admin only)
 */
router.get("/users/:page", middleware.isAdmin, adminController.getUserList);

/**
 * @route GET /1/users/profile/:user_id
 * @description Show one user profile
 * @access Private (Admin only)
 */
router.get(
  "/1/users/profile/:user_id",
  middleware.isAdmin,
  adminController.getUserProfile
);

/**
 * @route GET /1/users/activities/:user_id
 * @description Show all activities of one user
 * @access Private (Admin only)
 */
router.get(
  "/1/users/activities/:user_id",
  middleware.isAdmin,
  adminController.getUserAllActivities
);

/**
 * @route GET /2/profile
 * @description Admin profile
 * @access Private (Admin only)
 */
router.get("/2/profile", middleware.isAdmin, adminController.getAdminProfile);

/**
 * @route GET /bookstock/out/:filter/:value/:page
 * @description Get admin book stock
 * @access Private (Admin only)
 */
router.get(
  "/bookstock/out/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminStock
);

/**
 * @route GET /bookRequest/:filter/:value/:page
 * @description Get admin book requests
 * @access Private (Admin only)
 */
router.get(
  "/bookRequest/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminRequest
);

/**
 * @route GET /bookReturn/:filter/:value/:page
 * @description Show return request books
 * @access Private (Admin only)
 */
router.get(
  "/bookReturn/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getAdminReturn
);

// //admin -> notifications
// router.get("/notifications", (req, res) => {
//    res.send("This route is still under development. will be added in next version");
// });

module.exports = router;
