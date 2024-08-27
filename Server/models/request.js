/**
 * @module request
 * @description Mongoose schema for storing book request information in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Request
 * @property {Object} book_info - Information about the book being requested.
 * @property {mongoose.Schema.Types.ObjectId} book_info.id - Reference to the Book model.
 * @property {String} book_info.title - Title of the book.
 * @property {String} book_info.author - Author of the book.
 * @property {String} book_info.ISBN - ISBN of the book.
 * @property {String} book_info.category - Category of the book.
 * @property {Object} user_id - Information about the user who requested the book.
 * @property {mongoose.Schema.Types.ObjectId} user_id.id - Reference to the User model.
 * @property {String} user_id.username - Username of the user.
 */

const RequestSchema = new mongoose.Schema({
  book_info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
    author: String,
    ISBN: String,
    category: String,
  },

  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = mongoose.model("Request", RequestSchema);