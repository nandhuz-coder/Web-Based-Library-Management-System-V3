const express = require("express"),
  router = express.Router(),
  PER_PAGE = 12;

router.get("/api/global/user", (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
