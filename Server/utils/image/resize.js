/**
 * @module resize
 * @description Provides functionality to resize and save images using the sharp library.
 */

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

/**
 * @class Resize
 * @description Class for resizing and saving images.
 * @param {string} folder - The folder where the resized images will be saved.
 * @constructor
 * @returns {object} - An instance of the Resize class.
 */
class Resize {
  /**
   * @constructor
   * @param {string} folder - The folder where the resized images will be saved.
   */
  constructor(folder) {
    this.folder = folder;
  }

  /**
   * @function save
   * @description Resizes and saves the provided image buffer as a circular image.
   * @param {Buffer} buffer - The image buffer to be resized and saved.
   * @returns {Promise<string>} - The filename of the saved image.
   *
   * Workflow:
   * 1. Validate the provided buffer.
   * 2. Generate a unique filename for the image.
   * 3. Construct the file path using the generated filename.
   * 4. Create an SVG buffer for the circular mask.
   * 5. Use sharp to resize the image to 500x500 pixels and apply the circular mask.
   * 6. Save the processed image to the file path.
   * 7. Return the filename of the saved image.
   * 8. Handle any errors that occur during the image processing.
   */
  async save(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      console.error("Invalid buffer provided");
      throw new Error("Invalid buffer provided");
    }

    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    const size = 500;
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${
        size / 2
      }" r="${size / 2}" /></svg>`
    );

    try {
      const resizedBuffer = await sharp(buffer)
        .resize(size, size, {
          fit: sharp.fit.cover,
          withoutEnlargement: true,
        })
        .toBuffer();

      await sharp(resizedBuffer)
        .resize(size, size) // Ensure the final image has the same dimensions
        .composite([{ input: circleSvg, blend: "dest-in" }])
        .toFile(filepath);

      return filename;
    } catch (error) {
      console.error("Error processing image:", error);
      throw new Error("Error processing image");
    }
  }

  /**
   * @function filename
   * @description Generates a unique filename for the image.
   * @returns {string} - The generated filename.
   */
  static filename() {
    return `${uuidv4()}.png`;
  }

  /**
   * @function filepath
   * @description Constructs the file path for the image using the provided filename.
   * @param {string} filename - The filename of the image.
   * @returns {string} - The constructed file path.
   */
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}

module.exports = Resize;
