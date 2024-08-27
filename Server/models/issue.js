/**
 * @module issue
 * @description Mongoose schema for storing book issue information in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Issue
 * @property {Object} book_info - Information about the book being issued.
 * @property {mongoose.Schema.Types.ObjectId} book_info.id - Reference to the Book model.
 * @property {String} book_info.title - Title of the book.
 * @property {String} book_info.author - Author of the book.
 * @property {String} book_info.ISBN - ISBN of the book.
 * @property {String} book_info.category - Category of the book.
 * @property {Number} book_info.stock - Number of copies available in stock.
 * @property {Date} book_info.issueDate - Date when the book was issued.
 * @property {Date} book_info.returnDate - Date when the book is expected to be returned.
 * @property {Boolean} book_info.isRenewed - Flag indicating if the book has been renewed.
 * @property {Boolean} book_info.isReturn - Flag indicating if the book has been returned.
 * @property {Object} user_id - Information about the user who issued the book.
 * @property {mongoose.Schema.Types.ObjectId} user_id.id - Reference to the User model.
 * @property {String} user_id.username - Username of the user.
 */

const issueSchema = new mongoose.Schema({
  book_info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
    author: String,
    ISBN: String,
    category: String,
    stock: Number,
    issueDate: { type: Date, default: Date.now() },
    returnDate: { type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    isRenewed: { type: Boolean, default: false },
    isReturn: { type: Boolean, default: false },
  },

  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = mongoose.model("Issue", issueSchema);