const nodemailer = require("nodemailer");
const collection = require("../handler/collection");
const createEmailTemplate = require("./html/template-generator");
let option = null;
let email = null;
class EmailSender {
  constructor(type) {
    email = collection.mails.get(0);
    if (type == "login") option = email.toggles.signinOtp.mail;
    else option = email.toggles.signupOtp.mail;
    const selectedMail = email.mails.find(
      (mail) => mail && mail.email === option
    );
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: selectedMail.email,
        pass: selectedMail.authKey,
      },
    });
  }

  async sendOtp(to, username, otp) {
    try {
      if (!this.transporter) {
        throw new Error("Transporter is not initialized");
      }
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: to,
        subject: "Verify",
        text: "Your verification code.",
        html: createEmailTemplate("login", {
          username: username,
          otp: otp,
        }),
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}

module.exports = EmailSender;
