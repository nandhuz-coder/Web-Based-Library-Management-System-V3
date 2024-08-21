const MailConfig = require("../models/mail-config");
const faker = require("@faker-js/faker");

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
