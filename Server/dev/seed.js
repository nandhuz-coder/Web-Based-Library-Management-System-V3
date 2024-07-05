const Book = require("../models/book.js"),
  faker = require("faker"),
  category = [
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
  ],

  adjectives = Array.from({ length: 5000 }, () => faker.random.word()),
  nouns = Array.from({ length: 5000 }, () => faker.random.word()),
  generateTitle = () => {
    const numWords = Math.floor(Math.random() * 3) + 1;
    let title = "";
    for (let i = 0; i < numWords; i++) {
      title += `${adjectives[Math.floor(Math.random() * adjectives.length)]} `;
    }
    title += nouns[Math.floor(Math.random() * nouns.length)];
    return title.trim();
  };

async function seed(limit) {
  for (let i = 0; i < limit; i++) {
    const title = generateTitle();
    const index1 = Math.floor(Math.random() * 11);
    try {
      const book = new Book({
        title,
        ISBN: faker.random.uuid(),
        stock: Math.floor(Math.random() * 15),
        author: faker.name.findName(),
        description: faker.lorem.paragraphs(3),
        category: category[index1],
      });
      await book.save();
    } catch (err) {
      console.log("Error at creating books");
    }
  }
}

module.exports = seed;
