const collection = require("./collection");

/**
 * Finds books based on search criteria with pagination.
 * @param {Object} searchObj - The search criteria.
 * @param {string} [searchObj.title] - The title to search for.
 * @param {string} [searchObj.author] - The author to search for.
 * @param {string} [searchObj.category] - The category to search for.
 * @param {string} [searchObj.ISBN] - The ISBN to search for.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of items per page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of books and the count.
 */
exports.findBooks = async (searchObj, page, perPage) => {
  let booksArray = Array.from(collection.books.values());
  let books = booksArray;

  if (searchObj.title) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(searchObj.title.toLowerCase())
    );
  }
  if (searchObj.author) {
    books = books.filter((book) =>
      book.author.toLowerCase().includes(searchObj.author.toLowerCase())
    );
  }
  if (searchObj.category) {
    books = books.filter((book) => book.category === searchObj.category);
  }
  if (searchObj.ISBN) {
    books = books.filter((book) => book.ISBN === searchObj.ISBN);
  }
  if (searchObj.stock) {
    books = books.filter((book) => book.stock === searchObj.stock);
  }

  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};

/**
 * Finds a book by its ID.
 * @param {string} id - The ID of the book to find.
 * @returns {Promise<Object>} - A promise that resolves to the book object.
 */
exports.findBookById = async (id) => {
  if (!collection.books.has(id)) {
    return [];
  }
  return collection.books.get(id);
};

/**
 * Finds book titles by a search query.
 * @param {string} query - The search query.
 * @param {number} limit - The maximum number of results to return.
 * @returns {Promise<Array>} - A promise that resolves to an array of book titles.
 */
exports.findBookTitlesByQuery = async (query, limit = 10) => {
  try {
    const regex = new RegExp(query, "i");
    let booksArray = Array.from(collection.books.values());
    let books = booksArray.filter((book) => regex.test(book.title));
    return books.slice(0, limit).map((book) => book.title);
  } catch (err) {
    console.error("Error fetching book titles:", err);
    throw new Error("Server error");
  }
};

/**
 * Finds book authors by a search query.
 * @param {string} query - The search query.
 * @param {number} limit - The maximum number of results to return.
 * @returns {Promise<Array>} - A promise that resolves to an array of book authors.
 */
exports.findBookAuthorsByQuery = async (query, limit = 10) => {
  try {
    const regex = new RegExp(query, "i");
    let booksArray = Array.from(collection.books.values());
    let books = booksArray.filter((book) => regex.test(book.author));
    return books.slice(0, limit).map((book) => book.author);
  } catch (err) {
    console.error("Error fetching book authors:", err);
    throw new Error("Server error");
  }
};
