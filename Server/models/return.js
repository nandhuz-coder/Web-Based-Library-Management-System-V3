/**
 * @module return
 * @description Mongoose schema for storing book return information in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Return
 * @property {Object} book_info - Information about the book being returned.
 * @property {mongoose.Schema.Types.ObjectId} book_info.id - Reference to the Book model.
 * @property {String} book_info.title - Title of the book.
 * @property {String} book_info.author - Author of the book.
 * @property {String} book_info.ISBN - ISBN of the book.
 * @property {String} book_info.category - Category of the book.
 * @property {Object} user_id - Information about the user who returned the book.
 * @property {mongoose.Schema.Types.ObjectId} user_id.id - Reference to the User model.
 * @property {String} user_id.username - Username of the user.
 * @property {Object} issue_id - Information about the issue record associated with the return.
 * @property {mongoose.Schema.Types.ObjectId} issue_id.id - Reference to the Issue model.
 */

const ReturnSchema = new mongoose.Schema({
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
  issue_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  },
});

module.exports = mongoose.model("Return", ReturnSchema);