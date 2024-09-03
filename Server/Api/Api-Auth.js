const express = require("express");
const router = express.Router();
const collection = require("../utils/handler/collection");
const OTPService = require("../utils/otp/otp");
const EmailSender = require("../utils/mail/sendotp");
const passport = require("passport");

router.get("/otp-login", async (req, res) => {
  const mails = await collection.mails.get(0);
  if (!mails) {
    res.json({ otp: false });
  } else {
    const otp = await mails.toggles.signinOtp.switches;
    res.json({ otp: otp });
  }
});

router.post("/generate-otp", async (req, res, next) => {
  try {
    // Authenticate user credentials
    passport.authenticate("local", async (err, user) => {
      if (err) {
        // Handle authentication error
        return next(err);
      }
      if (!user) {
        // Handle invalid username or password
        return res.json({
          error: "Please provide valid username and password",
        });
      }

      // Generate OTP
      const otpService = new OTPService();
      const otp = otpService.generateOTP();
      const secret = otpService.getSecret();

      // Send OTP to user
      const emailSender = new EmailSender("login");
      await emailSender.sendOtp(user.email, user.username, otp, "Login");

      // Send success response
      res.json({ success: "OTP sent successfully", secret: secret });
    })(req, res, next);
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return res.json({ error: "Unknown error occurred" });
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const { otp, secret } = req.body;
    // Verify the OTP
    const otpService = new OTPService(secret);
    const isValidOtp = otpService.matchOTP(otp);
    if (!isValidOtp) {
      return res.json({ valid: false });
    }
    res.json({ valid: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
