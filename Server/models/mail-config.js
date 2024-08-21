const mongoose = require("mongoose");

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

//* Method to update toggles and set mail to null if switch is false
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

//* Method to delete a mail and update toggles
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

module.exports = mongoose.model("MailConfig", mailConfigSchema);
