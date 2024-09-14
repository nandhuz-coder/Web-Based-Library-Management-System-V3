const Book = require("../../models/book");
const collection = require("./collection");

/**
 * BookHandler function to collect book configurations from the database
 * and save them in the collection.books Map.
 *
 * This function fetches book configurations from the ConfigBook model,
 * clears any existing entries in the collection.books Map, and then
 * saves the fetched book configuration into the Map.
 *
 * @async
 * @function BookHandler
 * @returns {Promise<boolean>} Returns true if books are collected successfully, otherwise false.
 */
async function BookHandler() {
  try {
    // Fetch all books from the Book model
    const books = await Book.find();
    if (books.length === 0) {
      console.log("No books data found in the database");
      return true;
    }

    // Store each book in the collection using its _id as key
    books.forEach((book) => {
      collection.books.set(book._id.toString(), book);
    });

    return true;
  } catch (error) {
    console.error("Error collecting books:", error);
    return false;
  }
}

module.exports = BookHandler;
