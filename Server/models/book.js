/**
 * @module book
 * @description Mongoose schema for storing book information in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Book
 * @property {String} title - The title of the book.
 * @property {String} ISBN - The International Standard Book Number of the book.
 * @property {Number} stock - The number of copies available in stock.
 * @property {String} author - The author of the book.
 * @property {String} description - A brief description of the book.
 * @property {String} category - The category or genre of the book.
 * @property {Array<mongoose.Schema.Types.ObjectId>} comments - References to comments associated with the book.
 */

const bookSchema = new mongoose.Schema({
  title: String,
  ISBN: String,
  stock: Number,
  author: String,
  description: String,
  category: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Book", bookSchema);