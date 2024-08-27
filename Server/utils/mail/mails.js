/**
 * @module mails
 * @description Sends a test email using Nodemailer with Gmail.
 */

const nodemailer = require("nodemailer");

/**
 * @function sendTestEmail
 * @description Sends a test email using Nodemailer with Gmail.
 *
 * Workflow:
 * 1. Create a Nodemailer transporter using Gmail service and authentication details.
 * 2. Define the email options including sender, recipient, subject, and body.
 * 3. Use the transporter to send the email.
 * 4. Log the result of the email sending operation.
 *
 * @example
 * sendTestEmail();
 *
 * @see {@link https://nodemailer.com/about/|Nodemailer Documentation}
 */
function sendTestEmail() {
  // Create a Nodemailer transporter using Gmail service
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nandhagopan102@gmail.com",
      pass: "zgavpyhqudgzvmgz",
    },
  });

  // Define email options
  let mailOptions = {
    from: "your-email@gmail.com",
    to: "nandhagopan400@gmail.com",
    subject: "Test Email",
    text: "This is a test email sent using Nodemailer with Gmail.",
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Call the function to send the test email
sendTestEmail();
