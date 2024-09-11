const fs = require("fs");

/**
 * Logger class
 * @class
 * @classdesc Handles logging messages to a specified file.
 */
class Logger {
  /**
   * Creates an instance of Logger.
   * @param {string} file - The name of the log file (without extension).
   * @default "log"
   */
  constructor(file) {
    this.file = file || "log";
  }

  /**
   * Logs a message to the specified log file.
   * @param {string} name - The name or identifier for the log entry.
   * @param {string} logDetails - The details of the log entry.
   * @throws Will throw an error if name or logDetails are not provided.
   */
  log(name, logDetails) {
    if (!name || !logDetails) {
      throw new Error("Name and logDetails are required");
    }
    const now = new Date();
    const timestamp = now.toLocaleString();
    const logMessage = `${timestamp} - ${name}: ${logDetails}`;
    try {
      fs.appendFileSync(
        `${__dirname}/${this.file}.log`,
        logMessage +
          "\n-----------------------------------------------------------------\n"
      );
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }
}

module.exports = Logger;
