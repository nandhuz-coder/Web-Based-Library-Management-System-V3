const express = require("express"),
  router = express.Router();

// Importing controller
const bookController = require("../controllers/books");

// Fetch books by search value
router.post("/books/:filter/:value/:page", bookController.findBooks);

module.exports = router;
