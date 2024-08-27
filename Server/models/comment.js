/**
 * @module comment
 * @description Mongoose schema for storing comments on books in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Comment
 * @property {String} text - The text content of the comment.
 * @property {Object} author - Information about the author of the comment.
 * @property {mongoose.Schema.Types.ObjectId} author.id - Reference to the User model.
 * @property {String} author.username - Username of the author.
 * @property {Object} book - Information about the book the comment is associated with.
 * @property {mongoose.Schema.Types.ObjectId} book.id - Reference to the Book model.
 * @property {String} book.title - Title of the book.
 * @property {Date} date - The date when the comment was created.
 */

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },

  book: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
  },

  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Comment", commentSchema);