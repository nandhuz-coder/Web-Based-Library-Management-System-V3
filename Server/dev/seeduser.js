/**
 * @module seedUsers
 * @description Seeds the database with random user entries.
 * @param {number} limit - The number of users to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 */

const User = require("../models/user.js");
const faker = require("@faker-js/faker");

/**
 * @function seedUsers
 * @description Seeds the database with a specified number of random user entries.
 * @param {number} limit - The number of users to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 *
 * Workflow:
 * 1. Loop through the specified limit.
 * 2. For each iteration:
 *    a. Generate a random password.
 *    b. Create a new User object with random details (email, firstName, lastName, username, password, gender, address, image, isAdmin).
 *    c. Use passport-local-mongoose's register method to save the user to the database.
 *    d. Log a success message indicating the user was created successfully.
 *    e. Handle any errors that occur during the user creation.
 */
async function seedUsers(limit) {
  for (let i = 0; i < limit; i++) {
    try {
      // Generate a password
      const password = faker.internet.password();

      // Create a new User object with fields including password
      const user = new User({
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: password,
        gender: faker.helpers.randomize(["Male", "Female"]),
        address: faker.address.streetAddress(),
        image: faker.image.avatar(),
        isAdmin: false,
      });

      // Use passport-local-mongoose's register method
      await User.register(user, password);
      console.log(`User ${user.username} created successfully.`);
    } catch (err) {
      console.log("Error creating user:", err);
    }
  }
}

module.exports = seedUsers;
