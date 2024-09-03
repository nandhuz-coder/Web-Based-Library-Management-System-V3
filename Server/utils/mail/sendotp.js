/**
 * @file sendotp.js
 * @description This file contains the EmailSender class which is responsible for sending OTP emails using nodemailer.
 * @requires nodemailer
 * @requires ../handler/collection
 * @requires ./html/template-generator
 */
const nodemailer = require("nodemailer");
const collection = require("../handler/collection");
const createEmailTemplate = require("./html/template-generator");
let option = null;
let email = null;
/**
 * EmailSender class
 * @class
 * @classdesc Handles sending OTP emails for login and signup processes.
 */
class EmailSender {
  /**
   * Creates an instance of EmailSender.
   * @param {string} type - The type of email to send ("login" or "signup").
   */
  constructor(type) {
    email = collection.mails.get(0);
    if (type === "login") option = email.toggles.signinOtp?.mail;
    else option = email.toggles.signupOtp?.mail;
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

  /**
   * Sends an OTP email.
   * @async
   * @param {string} to - The recipient's email address.
   * @param {string} username - The recipient's username.
   * @param {string} otp - The OTP to send.
   * @returns {Promise<boolean>} - Returns true if the email was sent successfully, otherwise false.
   */
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
