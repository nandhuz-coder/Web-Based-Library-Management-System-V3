const collection = require("./collection");

/**
 * Finds books by title prefix with pagination.
 * @param {string} prefix - The prefix to search for.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of items per page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of books and the count.
 */
exports.findBooksByTitlePrefix = async (prefix, page, perPage) => {
  const lowerCasePrefix = prefix.toLowerCase();
  let booksArray = Array.from(collection.books.values());
  let books = booksArray.filter((book) =>
    book.title.toLowerCase().startsWith(lowerCasePrefix)
  );
  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};

/**
 * Finds books by author prefix with pagination.
 * @param {string} prefix - The prefix to search for.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of items per page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of books and the count.
 */
exports.findBooksByAuthorPrefix = async (prefix, page, perPage) => {
  const lowerCasePrefix = prefix.toLowerCase();
  let booksArray = Array.from(collection.books.values());
  let books = booksArray.filter((book) =>
    book.author.toLowerCase().startsWith(lowerCasePrefix)
  );
  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};

/**
 * Finds books by category with pagination.
 * @param {string} category - The category to search for.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of items per page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of books and the count.
 */
exports.findBooksByCategory = async (category, page, perPage) => {
  let booksArray = Array.from(collection.books.values());
  let books = booksArray.filter((book) => book.category === category);
  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};

/**
 * Finds books by ISBN with pagination.
 * @param {string} isbn - The ISBN to search for.
 * @param {number} page - The page number.
 * @param {number} perPage - The number of items per page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of books and the count.
 */
exports.findBooksByISBN = async (isbn, page, perPage) => {
  let booksArray = Array.from(collection.books.values());
  let books = booksArray.filter((book) => book.ISBN === isbn);
  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};

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

  const count = books.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return { books: books.slice(startIndex, endIndex), count: count };
};
