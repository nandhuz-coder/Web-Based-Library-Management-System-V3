/**
 * @module activity
 * @description Mongoose schema for storing activity logs in the database.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Activity
 * @property {Object} info - Information about the book related to the activity.
 * @property {mongoose.Schema.Types.ObjectId} info.id - Reference to the Book model.
 * @property {String} info.title - Title of the book.
 * @property {String} category - Category of the activity (e.g., "Issue", "Return", "Renew").
 * @property {Object} time - Information about the timing related to the activity.
 * @property {mongoose.Schema.Types.ObjectId} time.id - Reference to the Issue model.
 * @property {Date} time.returnDate - Return date of the book.
 * @property {Date} time.issueDate - Issue date of the book.
 * @property {Object} user_id - Information about the user related to the activity.
 * @property {mongoose.Schema.Types.ObjectId} user_id.id - Reference to the User model.
 * @property {String} user_id.username - Username of the user.
 * @property {Object} fine - Information about any fines related to the activity.
 * @property {Number} fine.amount - Amount of the fine.
 * @property {Date} fine.date - Date when the fine was issued.
 * @property {Date} entryTime - Timestamp when the activity was logged.
 */

const activitySchema = new mongoose.Schema({
  info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
  },

  category: String,

  time: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
    returnDate: Date,
    issueDate: Date,
  },

  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },

  fine: {
    amount: Number,
    date: Date,
  },

  entryTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Activity", activitySchema);
