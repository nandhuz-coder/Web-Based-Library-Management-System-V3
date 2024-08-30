/**
 * @module agenda
 * @description Configures and exports an instance of Agenda for job scheduling.
 */

const { Agenda } = require("agenda");
require("dotenv").config();

/**
 * @constant {string} mongoConnectionString - The connection string for MongoDB, constructed using environment variables.
 */
const mongoConnectionString = `${process.env.DB_URL}${process.env.DB_NAME}`;

/**
 * @constant {Agenda} agenda - An instance of Agenda configured to use the specified MongoDB connection string and collection.
 * @property {Object} db - The database configuration for Agenda.
 * @property {string} db.address - The MongoDB connection string.
 * @property {string} db.collection - The collection name where jobs will be stored.
 *
 * Workflow:
 * 1. Load environment variables from a .env file using dotenv.
 * 2. Construct the MongoDB connection string using the DB_URL and DB_NAME environment variables.
 * 3. Create a new instance of Agenda with the following configuration:
 *    a. `db.address`: The MongoDB connection string.
 *    b. `db.collection`: The name of the collection where jobs will be stored ("jobs").
 * 4. Export the configured Agenda instance for use in other parts of the application.
 */
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "jobs" },
});

module.exports = agenda;
