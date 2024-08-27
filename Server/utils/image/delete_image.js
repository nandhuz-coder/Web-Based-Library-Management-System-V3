/**
 * @module deleteImage
 * @description Deletes an image file from the filesystem.
 * @param {string} imagePath - The path to the image file to be deleted.
 * @param {function} next - The next middleware function in the stack.
 */

const fs = require("fs");

/**
 * @function deleteImage
 * @description Deletes an image file from the filesystem.
 * @param {string} imagePath - The path to the image file to be deleted.
 * @param {function} next - The next middleware function in the stack.
 *
 * Workflow:
 * 1. Call fs.unlink to delete the file at the specified imagePath.
 * 2. If an error occurs during deletion, log an error message.
 * 3. If no error occurs, the file is successfully deleted.
 */
const deleteImage = (imagePath, next) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log("Failed to delete image at delete profile");
      return;
    }
    next();
  });
};

module.exports = deleteImage;
