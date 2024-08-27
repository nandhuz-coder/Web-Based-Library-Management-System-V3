const express = require("express");
const router = express.Router();

/**
 * Route to check if the user is authenticated and redirect accordingly.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with redirect URL or true.
 */
router.get("/ifuser", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.json({ redirect: "/admin" });
    } else {
      return res.json({ redirect: "/user/dashboard/1" });
    }
  } else {
    return res.json(true);
  }
});

/**
 * Route to check if the user is an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with flag indicating admin status.
 */
router.get("/ifadmin", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return res.json({ flag: true });
    } else {
      return res.json({ flag: false });
    }
  } else {
    return res.json({ flag: false });
  }
});

/**
 * Route to check if the user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON response with flag indicating authentication status.
 */
router.get("/isuser", async (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ flag: true });
  } else {
    res.json({ flag: false });
  }
});

module.exports = router;
