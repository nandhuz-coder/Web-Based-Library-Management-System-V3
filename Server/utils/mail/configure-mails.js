/**
 * @module configure-mails
 * @description Provides functionality to configure and send emails using nodemailer.
 */

const nodemailer = require("nodemailer");
const MailConfig = require("../../models/mail-config");
const createEmailTemplate = require("./html/template-generator");
const Logger = require("../../logs/logs");

/**
 * @class EmailService
 * @description Service class for handling email configuration and sending.
 * @property {Object} transporter - The nodemailer transporter object.
 * @method initializeTransporter - Initializes the nodemailer transporter with the provided email and authentication key.
 * @method VerifyMail - Sends a verification email to the specified recipient and updates the mail configuration in the database.
 * @example
 * const emailService = new EmailService();
 * emailService.initializeTransporter("your-email@gmail.com", "your-auth-key"); // Initialize the transporter
 * emailService.VerifyMail("recipient-email@gmail.com"); // Send a verification email
 * @see {@link https://nodemailer.com/about/ |Nodemailer Documentation}
 * @see {@link https://mongoosejs.com/docs/ |Mongoose Documentation}
 */
class EmailService {
  constructor() {
    /**
     * @property {Object} transporter - The nodemailer transporter object.
     */
    this.transporter = null;
  }

  /**
   * @function initializeTransporter
   * @description Initializes the nodemailer transporter with the provided email and authentication key.
   * @param {string} email - The email address to be used for sending emails.
   * @param {string} authKey - The authentication key for the email address.
   *
   * Workflow:
   * 1. Create a nodemailer transporter using the provided email and auth key.
   * 2. Set the transporter to the instance variable.
   */
  initializeTransporter(email, authKey) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: authKey,
      },
    });
  }

  /**
   * @function VerifyMail
   * @description Sends a verification email to the specified recipient and updates the mail configuration in the database.
   * @param {string} to - The recipient email address.
   * @returns {Promise<Object>} - Returns a promise that resolves with a success message if the email is sent successfully.
   *
   * Workflow:
   * 1. Check if the transporter is initialized. If not, throw an error.
   * 2. Define the mail options including the sender, recipient, subject, and body.
   * 3. Attempt to send the email using the transporter.
   * 4. If the email is sent successfully, update the mail configuration in the database:
   *    a. Find the existing mail configuration.
   *    b. If found, update the existing mail entry or add a new one.
   *    c. If not found, create a new mail configuration entry.
   * 5. Save the updated or new mail configuration to the database.
   * 6. Return a success message.
   * 7. Handle any errors that occur during the email sending process:
   *    a. Find the existing mail configuration.
   *    b. If found, update the existing mail entry to set `configured` to `false`.
   *    c. Save the updated mail configuration to the database.
   *    d. If the error response code is 535, throw an error indicating that the auth key needs to be changed.
   *    e. For other errors, log the error message and throw a generic error.
   */
  async VerifyMail(to) {
    if (!this.transporter) {
      throw new Error("Transporter is not initialized");
    }

    const mailOptions = {
      from: this.transporter.options.auth.user,
      to: to,
      subject: "Verify",
      text: "Auth Successfully verified.",
      html: createEmailTemplate("configure", { email: to }),
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
      const logs = new Logger("email");
      logs.log("Email", "Auth key verified");
      return { message: "Auth key verified" };
    } catch (error) {
      let mailConfig = await MailConfig.findOne();
      if (mailConfig) {
        const existingMail = mailConfig.mails.find(
          (mail) => mail.email === this.transporter.options.auth.user
        );
        if (existingMail) existingMail.configured = false;

        await mailConfig.save();
      }
      const logs = new Logger("email");
      if (error.responseCode === 535) {
        logs.log("Email", `Change auth key for ${to}`);
        throw new Error("Change auth key");
      } else {
        console.log("Error:", error.message);
        logs.log("Email", `${error.message} for ${to}`);
        throw new Error(error.message);
      }
    }
  }
}

module.exports = EmailService;
