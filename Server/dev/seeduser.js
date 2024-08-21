const User = require("../models/user.js");
const faker = require("@faker-js/faker");

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
