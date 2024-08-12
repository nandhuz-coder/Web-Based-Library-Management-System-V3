const mongoose = require("mongoose");

const mailConfigSchema = new mongoose.Schema({
  toggles: {
    requestBooks: { type: Boolean, default: false },
    issueBooks: { type: Boolean, default: false },
    passwordUpdateOtp: { type: Boolean, default: false },
    signupOtp: { type: Boolean, default: false },
    signinOtp: { type: Boolean, default: false },
    demoSwitch: { type: Boolean, default: false },
  },
  mails: [
    {
      email: { type: String, required: true },
      authKey: { type: String, required: true },
      configured: { type: Boolean, required: true, default: false },
    },
  ],
});

module.exports = mongoose.model("MailConfig", mailConfigSchema);
