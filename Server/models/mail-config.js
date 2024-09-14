const mongoose = require("mongoose");
const collection = require("../utils/handler/collection");

/**
 * @module mail-config
 * @description Mongoose schema for storing mail configuration settings in the database.
 */

/**
 * @typedef {Object} MailConfig
 * @property {Object} toggles - Configuration toggles for various mail settings.
 * @property {Object} toggles.requestBooks - Toggle for request books mail setting.
 * @property {Boolean} toggles.requestBooks.switches - Switch for request books mail setting.
 * @property {String} toggles.requestBooks.mail - Mail address for request books setting.
 * @property {Object} toggles.issueBooks - Toggle for issue books mail setting.
 * @property {Boolean} toggles.issueBooks.switches - Switch for issue books mail setting.
 * @property {String} toggles.issueBooks.mail - Mail address for issue books setting.
 * @property {Object} toggles.passwordUpdateOtp - Toggle for password update OTP mail setting.
 * @property {Boolean} toggles.passwordUpdateOtp.switches - Switch for password update OTP mail setting.
 * @property {String} toggles.passwordUpdateOtp.mail - Mail address for password update OTP setting.
 * @property {Object} toggles.signupOtp - Toggle for signup OTP mail setting.
 * @property {Boolean} toggles.signupOtp.switches - Switch for signup OTP mail setting.
 * @property {String} toggles.signupOtp.mail - Mail address for signup OTP setting.
 * @property {Object} toggles.signinOtp - Toggle for signin OTP mail setting.
 * @property {Boolean} toggles.signinOtp.switches - Switch for signin OTP mail setting.
 * @property {String} toggles.signinOtp.mail - Mail address for signin OTP setting.
 * @property {Array<Object>} mails - Array of mail configurations.
 * @property {String} mails.email - Email address.
 * @property {String} mails.authKey - Authentication key for the email.
 * @property {Boolean} mails.configured - Flag indicating if the mail is configured.
 */

const mailConfigSchema = new mongoose.Schema({
  toggles: {
    requestBooks: {
      switches: { type: Boolean, default: false },
      mail: { type: String, default: null },
    },
    issueBooks: {
      switches: { type: Boolean, default: false },
      mail: { type: String, default: null },
    },
    passwordUpdateOtp: {
      switches: { type: Boolean, default: false },
      mail: { type: String, default: null },
    },
    signupOtp: {
      switches: { type: Boolean, default: false },
      mail: { type: String, default: null },
    },
    signinOtp: {
      switches: { type: Boolean, default: false },
      mail: { type: String, default: null },
    },
  },
  mails: [
    {
      email: { type: String, required: true },
      authKey: { type: String, required: true },
      configured: { type: Boolean, required: true, default: false },
    },
  ],
});

/**
 * @function updateToggles
 * @description Updates the toggles and sets mail to null if the switch is false.
 * @param {Object} toggles - The new toggle settings.
 * @param {Object} selections - The new mail selections.
 *
 * Workflow:
 * 1. Update each toggle setting with the new value.
 * 2. If the toggle is false, set the corresponding mail to null.
 */
mailConfigSchema.methods.updateToggles = function (toggles, selections) {
  this.toggles.requestBooks = {
    switches: toggles.requestBooks,
    mail: toggles.requestBooks ? selections.requestBooks : null,
  };
  this.toggles.issueBooks = {
    switches: toggles.issueBooks,
    mail: toggles.issueBooks ? selections.issueBooks : null,
  };
  this.toggles.passwordUpdateOtp = {
    switches: toggles.passwordUpdateOtp,
    mail: toggles.passwordUpdateOtp ? selections.passwordUpdateOtp : null,
  };
  this.toggles.signupOtp = {
    switches: toggles.signupOtp,
    mail: toggles.signupOtp ? selections.signupOtp : null,
  };
  this.toggles.signinOtp = {
    switches: toggles.signinOtp,
    mail: toggles.signinOtp ? selections.signinOtp : null,
  };
};

/**
 * @function deleteMailAndUpdateToggles
 * @description Deletes a mail and updates the toggles accordingly.
 * @param {String} email - The email to be deleted.
 *
 * Workflow:
 * 1. Filter out the mail to be deleted from the mails array.
 * 2. For each toggle, if the mail matches the email to be deleted, set the toggle to false and mail to null.
 */
mailConfigSchema.methods.deleteMailAndUpdateToggles = function (email) {
  this.mails = this.mails.filter((mail) => mail.email !== email);
  if (this.toggles.requestBooks.mail === email) {
    this.toggles.requestBooks.switches = false;
    this.toggles.requestBooks.mail = null;
  }
  if (this.toggles.issueBooks.mail === email) {
    this.toggles.issueBooks.switches = false;
    this.toggles.issueBooks.mail = null;
  }
  if (this.toggles.passwordUpdateOtp.mail === email) {
    this.toggles.passwordUpdateOtp.switches = false;
    this.toggles.passwordUpdateOtp.mail = null;
  }
  if (this.toggles.signupOtp.mail === email) {
    this.toggles.signupOtp.switches = false;
    this.toggles.signupOtp.mail = null;
  }
  if (this.toggles.signinOtp.mail === email) {
    this.toggles.signinOtp.switches = false;
    this.toggles.signinOtp.mail = null;
  }
};

// Middleware to update the in-memory collection on save
mailConfigSchema.post("save", function (doc) {
  collection.mails.clear();
  collection.mails.set(0, doc);
});

// Middleware to update the in-memory collection on delete
mailConfigSchema.post("remove", function (doc) {
  collection.mails.delete(0);
  collection.mails.clear();
});

// Middleware to update the in-memory collection on update
mailConfigSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    collection.mails.clear();
    collection.mails.set(0, doc);
  }
});

module.exports = mongoose.model("MailConfig", mailConfigSchema);
