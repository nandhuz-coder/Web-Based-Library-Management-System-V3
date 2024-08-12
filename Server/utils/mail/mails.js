const nodemailer = require("nodemailer");

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
