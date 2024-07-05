const mongoose = require("mongoose");

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
