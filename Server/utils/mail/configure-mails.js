const nodemailer = require("nodemailer");
const MailConfig = require("../../models/mail-config");

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Initialize the transporter with email and auth key
  initializeTransporter(email, authKey) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: authKey,
      },
    });
  }
  // Send an email with static subject and body
  async sendEmail(to) {
    if (!this.transporter) {
      throw new Error("Transporter is not initialized");
    }

    const mailOptions = {
      from: this.transporter.options.auth.user,
      to: to,
      subject: "Verify",
      text: "Auth Successfully verified.",
    };

    try {
      await this.transporter.sendMail(mailOptions);
      let mailConfig = await MailConfig.findOne();
      if (mailConfig) {
        const existingMail = mailConfig.mails.find(
          (mail) => mail.email === this.transporter.options.auth.user
        );
        if (existingMail) {
          existingMail.authKey = this.transporter.options.auth.pass;
          existingMail.configured = true;
        } else {
          mailConfig.mails.push({
            email: this.transporter.options.auth.user,
            authKey: this.transporter.options.auth.pass,
            configured: true,
          });
        }
        await mailConfig.save();
      } else {
        const newMailConfig = new MailConfig({
          mails: [
            {
              email: this.transporter.options.auth.user,
              authKey: this.transporter.options.auth.pass,
              configured: true,
            },
          ],
        });
        await newMailConfig.save();
      }
      return { message: "Auth key verified" };
    } catch (error) {
      if (error.responseCode === 535) {
        throw new Error("Change auth key");
      } else {
        console.log("Error:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

module.exports = EmailService;
