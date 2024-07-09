const express = require("express"),
  router = express.Router();

router.get("/middleware/ifuser", async (req, res) => {
  console.log("hi");
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) return res.json({ redirect: "/admin" });
    else return res.json({ redirect: "/user" });
  } else {
    return res.json(true);
  }
});
module.exports = router;
