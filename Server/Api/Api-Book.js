/**
 * @file Api-Book.js
 * @api true
 * @router /api/book
 * @description This file defines routes for book operations.
 * @module bookController needed for book operations
 */

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/api/books");

/**
 * Route to get books with pagination.
 * @route GET /:filter/:value/:page
 * @param {string} filter - The filter to apply (e.g., genre, author).
 * @param {string} value - The value of the filter.
 * @param {number} page - The page number for pagination.
 */
router.get("/:filter/:value/:page", bookController.getBooks);

/**
 * Route to get details of a specific book.
 * @route GET /details/:bookid
 * @param {string} bookid - The ID of the book to get details for.
 */
router.get("/details/:bookid", bookController.getBookDetails);

/**
 * Route to request a book.
 * @route POST /:book_id/request/:user_id/:current
 * @param {string} book_id - The ID of the book to request.
 * @param {string} user_id - The ID of the user requesting the book.
 * @param {string} current - The current status of the request.
 */
router.post("/:book_id/request/:user_id/:current", bookController.requestBook);

module.exports = router;
