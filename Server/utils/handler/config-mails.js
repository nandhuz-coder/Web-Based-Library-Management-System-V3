const ConfigMail = require("../../models/mail-config");
const collection = require("./collection");

/**
 * MailHandler function to collect mail configurations from the database
 * and save them in the collection.mails Map.
 *
 * This function fetches mail configurations from the ConfigMail model,
 * clears any existing entries in the collection.mails Map, and then
 * saves the fetched mail configuration into the Map.
 *
 * @async
 * @function MailHandler
 * @returns {Promise<boolean>} Returns true if mails are collected successfully, otherwise false.
 */
async function MailHandler() {
  try {
    // Clear the existing mails in the collection
    collection.mails.clear();

    // Fetch a single mail configuration from the ConfigMail model
    const mail = await ConfigMail.findOne();

    // Save the mail configuration in the collection.mails Map
    if (mail) {
      collection.mails.set(0, mail);
    } else {
      console.log("No mail configuration found in the database");
    }
    return true;
  } catch (error) {
    console.error("Error collecting mails:", error);
    return false;
  }
}

module.exports = MailHandler;
