const express = require("express"),
  router = express.Router();

router.get("/middleware/ifuser", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) return res.json({ redirect: "/admin" });
    else return res.json({ redirect: "/user" });
  } else {
    return res.json(true);
  }
});

router.get("/middleware/ifadmin", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) return res.json({ flag: true });
    else return res.json({ flag: false });
  } else {
    return res.json({ flag: false });
  }
});

router.get("/middleware/isuser", async (req, res) => {
  if (req.isAuthenticated()) res.json({ flag: true });
  else res.json({ flag: false });
});

module.exports = router;
