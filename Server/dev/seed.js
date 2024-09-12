/**
 * @module seed
 * @description Seeds the database with random book entries.
 * @param {number} limit - The number of books to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 */

const Book = require("../models/book.js");
const { faker } = require("@faker-js/faker");

const category = [
  "Science",
  "Biology",
  "Physics",
  "Chemistry",
  "Novel",
  "Travel",
  "Cooking",
  "Philosophy",
  "Mathematics",
  "Ethics",
  "Technology",
];

const adjectives = Array.from({ length: 5000 }, () => faker.word.adjective());
const nouns = Array.from({ length: 5000 }, () => faker.word.noun());

/**
 * @function generateTitle
 * @description Generates a random book title using a combination of adjectives and nouns.
 * @returns {string} - A randomly generated book title.
 *
 * Workflow:
 * 1. Determine the number of words in the title (between 1 and 3).
 * 2. Initialize an empty string for the title.
 * 3. Loop through the number of words, appending a random adjective to the title.
 * 4. Append a random noun to the title.
 * 5. Return the generated title, trimmed of any extra spaces.
 */
const generateTitle = () => {
  const numWords = Math.floor(Math.random() * 3) + 1;
  let title = "";
  for (let i = 0; i < numWords; i++) {
    title += `${adjectives[Math.floor(Math.random() * adjectives.length)]} `;
  }
  title += nouns[Math.floor(Math.random() * nouns.length)];
  return title.trim();
};

/**
 * @function seed
 * @description Seeds the database with a specified number of random book entries.
 * @param {number} limit - The number of books to seed into the database.
 * @returns {Promise<void>} - Returns a promise that resolves when the seeding is complete.
 *
 * Workflow:
 * 1. Loop through the specified limit.
 * 2. For each iteration:
 *    a. Generate a random book title.
 *    b. Select a random category index.
 *    c. Create a new book object with random details (title, ISBN, stock, author, description, category).
 *    d. Save the book object to the database.
 *    e. Handle any errors that occur during the book creation.
 */
async function seed(limit) {
  for (let i = 0; i < limit; i++) {
    const title = generateTitle();
    const index1 = Math.floor(Math.random() * category.length);
    try {
      const book = new Book({
        title,
        ISBN: faker.string.uuid(),
        stock: Math.floor(Math.random() * 15),
        author: faker.person.fullName(),
        description: faker.lorem.paragraphs(3),
        category: category[index1],
      });
      await book.save();
    } catch (err) {
      console.log("Error at creating books", err);
    }
  }
}

module.exports = seed;
