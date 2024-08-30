/**
 * @module queue
 * @description Configures and starts the Agenda job scheduler, and sets up a recurring job for checking email authentication verification.
 */

const agenda = require("./agenda");
require("./verify-mail");

/**
 * @function startAgenda
 * @description Starts the Agenda job scheduler and sets up a recurring job to check email authentication verification every minute.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the agenda starts successfully, otherwise false.
 *
 * Workflow:
 * 1. Import the configured Agenda instance from the `agenda` module.
 * 2. Import the `verify-mail` module to ensure email verification jobs are defined.
 * 3. Define an asynchronous function `startAgenda` to start the Agenda job scheduler.
 * 4. Inside the function:
 *    a. Attempt to start the Agenda instance using `agenda.start()`.
 *    b. Schedule a recurring job named "check auth verification" to run every minute using `agenda.every("12 am", "check auth verification")`.
 *    c. If both operations succeed, return true.
 *    d. If an error occurs, log the error message to the console and return false.
 * 5. Export the `startAgenda` function for use in other parts of the application.
 */
async function startAgenda() {
  try {
    await agenda.start();
    await agenda.every("0 0 12 * * *", "check auth verification");
    return true;
  } catch (error) {
    console.error("Failed to start agenda:", error.message);
    return false;
  }
}

module.exports = startAgenda;
