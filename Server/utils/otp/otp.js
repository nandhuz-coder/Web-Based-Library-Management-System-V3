const otplib = require("otplib");

// Configure otplib options
otplib.authenticator.options = {
  step: 120, // 120 seconds time step
  window: 1, // Allow one time step before and after
  digits: 6, // Number of digits in the OTP
  algorithm: "sha1", // Hashing algorithm
  encoding: "ascii", // Encoding of the secret
};

/**
 * OTPService class for generating and validating OTPs.
 */
class OTPService {
  /**
   * Constructor for OTPService.
   * @param {string} [secret] - The secret key for generating OTPs. If not provided, a new secret will be generated.
   */
  constructor(secret) {
    this.secret = secret || otplib.authenticator.generateSecret();
  }

  /**
   * Generates a new OTP based on the secret.
   * @returns {string} The generated OTP.
   */
  generateOTP() {
    const otp = otplib.authenticator.generate(this.secret);
    return otp;
  }

  /**
   * Validates the provided OTP against the secret.
   * @param {string} otp - The OTP to be validated.
   * @returns {boolean} True if the OTP is valid, false otherwise.
   */
  matchOTP(otp) {
    try {
      const isValid = otplib.authenticator.check(otp.toString(), this.secret);
      return isValid;
    } catch (error) {
      console.error(`Error during OTP validation: ${error}`);
      return false;
    }
  }

  /**
   * Returns the secret key used for generating OTPs.
   * @returns {string} The secret key.
   */
  getSecret() {
    return this.secret;
  }
}

module.exports = OTPService;
