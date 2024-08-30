/**
 * @module verify-mail
 * @description Defines and schedules a job to check email authentication verification using Agenda.
 */

const agenda = require("./agenda");
const EmailService = require("../mail/configure-mails");
const collection = require("../handler/collection");

/**
 * @function checkAuthVerification
 * @description Defines the "check auth verification" job for Agenda, which verifies email authentication for each email in the collection.
 *
 * Workflow:
 * 1. Import the configured Agenda instance from the `agenda` module.
 * 2. Import the `EmailService` class for handling email operations.
 * 3. Import the `collection` module to access the email collection.
 * 4. Define the "check auth verification" job using `agenda.define`:
 *    a. Retrieve the email collection using `collection.mails.get(0)`.
 *    b. Create an instance of `EmailService`.
 *    c. Iterate over each email in the collection:
 *       i. Initialize the email transporter with the email and auth key.
 *       ii. Verify the email using `emailService.VerifyMail`.
 *    d. Handle any errors that occur during the job execution and log the error message to the console.
 */
agenda.define("check auth verification", async () => {
  try {
    const MailsCollection = await collection.mails.get(0);
    const emailService = new EmailService();
    MailsCollection.mails.forEach(async (mail) => {
      emailService.initializeTransporter(mail.email, mail.authKey);
      await emailService.VerifyMail(mail.email);
    });
  } catch (jobError) {
    console.error("Error during job execution:", jobError.message);
  }
});
