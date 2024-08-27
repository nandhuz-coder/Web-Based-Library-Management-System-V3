/**
 * @module seedMail
 * @description Seeds the database with random mail configurations.
 * @param {number} limit - The number of mail configurations to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 */

const MailConfig = require("../models/mail-config");
const faker = require("@faker-js/faker");

/**
 * @function seedMailConfig
 * @description Seeds the database with a specified number of random mail configurations.
 * @param {number} limit - The number of mail configurations to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 *
 * Workflow:
 * 1. Define a function to generate random toggles for mail configurations.
 * 2. Define a function to generate an array of random mail configurations.
 * 3. Loop through the specified limit.
 * 4. For each iteration:
 *    a. Generate random toggles.
 *    b. Generate a random number of mail configurations (between 1 and 5).
 *    c. Create a new mail configuration object with the generated toggles and mail configurations.
 *    d. Save the mail configuration object to the database.
 *    e. Log the success message or handle any errors that occur during the mail configuration creation.
 */
async function seedMailConfig(limit) {
  // Generate an array of toggles
  const generateToggles = () => ({
    requestBooks: Math.random() > 0.5,
    issueBooks: Math.random() > 0.5,
    passwordUpdateOtp: Math.random() > 0.5,
    signupOtp: Math.random() > 0.5,
    signinOtp: Math.random() > 0.5,
    demoSwitch: Math.random() > 0.5,
  });

  // Generate an array of mail configurations
  const generateMailConfigs = (numConfigs) => {
    return Array.from({ length: numConfigs }, () => ({
      email: faker.internet.email(),
      authKey: faker.random.uuid(), // Use faker.random.uuid() here
    }));
  };

  for (let i = 0; i < limit; i++) {
    const toggles = generateToggles();
    const mails = generateMailConfigs(Math.floor(Math.random() * 5) + 1); // Random number of mail configs between 1 and 5

    try {
      const mailConfig = new MailConfig({
        toggles,
        mails,
      });
      await mailConfig.save();
      console.log(`Mail configuration ${i + 1} saved`);
    } catch (err) {
      console.log(`Error creating mail configuration ${i + 1}:`, err);
    }
  }
}

module.exports = seedMailConfig;
