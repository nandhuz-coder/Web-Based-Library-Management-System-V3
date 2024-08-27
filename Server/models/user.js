/**
 * @module user
 * @description Mongoose schema for storing user information in the database.
 */

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

/**
 * @typedef {Object} User
 * @property {String} email - The email address of the user.
 * @property {Boolean} isAdmin - Flag indicating if the user is an admin.
 * @property {String} firstName - The first name of the user.
 * @property {String} lastName - The last name of the user.
 * @property {String} username - The username of the user.
 * @property {String} gender - The gender of the user.
 * @property {String} address - The address of the user.
 * @property {String} image - The profile image of the user.
 * @property {Array<Object>} bookRequestInfo - Information about the books requested by the user.
 * @property {Array<Object>} bookIssueInfo - Information about the books issued by the user.
 * @property {Array<Object>} bookReturnInfo - Information about the books returned by the user.
 * @property {Date} joined - The date when the user joined.
 * @property {Boolean} violationFlag - Flag indicating if the user has any violations.
 * @property {Number} fines - The amount of fines the user has.
 */

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // Personal information
  firstName: {
    type: String,
    trim: false,
  },
  lastName: {
    type: String,
    trim: false,
  },
  username: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    default: "profile.png",
  },

  // Book Request information
  bookRequestInfo: [
    {
      book_info: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Request",
        },
      },
    },
  ],

  // Book issue information
  bookIssueInfo: [
    {
      book_info: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Issue",
        },
      },
    },
  ],

  // Book Return information
  bookReturnInfo: [
    {
      book_info: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Return",
        },
      },
    },
  ],

  // Other fields
  joined: {
    type: Date,
    default: Date.now,
  },
  violationFlag: {
    type: Boolean,
    default: false,
  },
  fines: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
