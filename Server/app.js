/**
 * @file app.js
 * @description Main application file for configuring and starting the Express server.
 */

//* Import packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const methodOverride = require("method-override");
const path = require("path");
const MongoStore = require("connect-mongo");
const compression = require("compression");
const passport = require("passport");
const localStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const serveStatic = require("serve-static");

//* Import Logger
const Logger = require("./logs/logs");
const logs = new Logger("app");

//* Import models
const User = require("./models/user");

//* Import collections
const collection = require("./utils/handler/collection");

//* Import handlers
const MailHandler = require("./utils/handler/config-mails");
const BookHandler = require("./utils/handler/books");

//* Import queue
const startAgenda = require("./utils/queue/queue");

//* Import Routes
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

//* Api Routes
const ApiAdmin = require("./Api/Api-Admin");
const ApiBooks = require("./Api/Api-Book");
const ApiUser = require("./Api/Api-user");
const ApiAuth = require("./Api/Api-Auth");
const ApiMiddleware = require("./middleware/middleware");
const suggestion = require("./Api/suggestions");

//* Initialize collections
/**
 * Initialize the mails collection as a Map.
 * Initialize the books collection as a Map.
 */
collection.mails = new Map();
collection.books = new Map();

//* Environment variables
if (process.env.NODE_ENV !== "production") require("dotenv").config();

//* Express application
/**
 * Creates an Express application.
 */
const app = express();

//* App configuration
/**
 * Middleware configuration for the Express application.
 * - compression: Compresses response bodies for all requests. The compression level is set to 6, which balances CPU usage and compression ratio.
 * - helmet: Helps secure the app by setting various HTTP headers.
 * - cors: Enables Cross-Origin Resource Sharing (CORS) to allow requests from specified origins.
 * - express.json: Parses incoming requests with JSON payloads.
 * - express.urlencoded: Parses incoming requests with URL-encoded payloads.
 * - mongoSanitize: Prevents MongoDB Operator Injection.
 * - hpp: Protects against HTTP Parameter Pollution attacks.
 * - methodOverride: Allows the use of HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
 * - cookieParser: Parses Cookie header and populates req.cookies with an object keyed by the cookie names.
 */
app.use(compression({ level: 6 })); // Set compression level from 0 to 9. Higher levels use more CPU but compress more data.
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" })); // change origin according to your front-end URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(methodOverride("_method"));
app.use(cookieParser());

//* Database configuration
/**
 * Connects to the MongoDB database using Mongoose.
 * - Reads the database URL and name from environment variables.
 * - Logs a success message if the connection is successful.
 * - Logs an error message if the connection fails.
 */
mongoose
  .connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(async () => {
    logs.log("info", "MongoDB is connected");
    console.log("MongoDB is connected");

    //! Calling the BookHandler function.
    /**
     * Calls the BookHandler function and handles the result.
     * The BookHandler function collects books data from the database
     * and saves it in the collection.books Map.
     * The result of the operation is logged to the console.
     */
    BookHandler().then((result) => {
      if (result) {
        console.log("\x1b[34mBooks collected successfully\x1b[0m");
      } else {
        console.log("\x1b[31mError collecting books\x1b[0m");
      }
    });

    //! Calling the MailHandler function.
    /**
     * Call the MailHandler function when the server starts.
     * The MailHandler function collects mail configurations from the database
     * and saves them in the collection.mails Map.
     * The result of the operation is logged to the console.
     */
    await MailHandler().then((result) => {
      if (result) console.log("\x1b[34mMails collected successfully\x1b[0m");
      else console.log("\x1b[31mError collecting mails\x1b[0m");
    });

    //! Starting the agenda.
    /**
     * Start the agenda when the server starts.
     * The startAgenda function initializes and starts the agenda for processing jobs.
     * The result of the operation is logged to the console
     * as either "Agenda started successfully" or "Error starting agenda".
     * The agenda is used to schedule and process jobs, such as sending verification emails.
     */
    await startAgenda().then((result) => {
      if (result) console.log("\x1b[34mAgenda started successfully\x1b[0m");
      else console.log("\x1b[31mError starting agenda\x1b[0m");
    });
  })
  .catch((error) => console.log(error));

//* Session configuration with connect-mongo
/**
 * Configures session management using connect-mongo to store session data in MongoDB.
 * - mongoUrl: The MongoDB connection URL.
 * - dbName: The name of the database to store session data.
 * - collectionName: The name of the collection to store session data.
 * - autoRemove: The method to remove expired sessions.
 * - autoRemoveInterval: The interval in minutes to remove expired sessions.
 */
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  collectionName: "sessions",
  autoRemove: "interval",
  autoRemoveInterval: 7 * 24 * 60, // 7 days
});

/**
 * Configures session management for the Express application.
 * - name: The name of the session ID cookie to set in the response.
 * - secret: The secret used to sign the session ID cookie.
 * - saveUninitialized: Forces a session that is "uninitialized" to be saved to the store.
 * - resave: Forces the session to be saved back to the session store, even if the session was never modified during the request.
 * - store: The session store instance.
 * - cookie: The session cookie settings.
 *   - maxAge: The maximum age (in milliseconds) of the session cookie.
 *   - secure: Ensures the browser only sends the cookie over HTTPS.
 *   - httpOnly: Ensures the cookie is sent only over HTTP(S), not client JavaScript.
 */
app.use(
  session({
    name: "library",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false,
      httpOnly: true,
    },
  })
);

//* Passport configuration
/**
 * Configures Passport for user authentication.
 * - passport.use: Sets up the local strategy for authenticating users.
 * - passport.serializeUser: Serializes the user object to store in the session.
 * - passport.deserializeUser: Deserializes the user object from the session.
 * - passport.initialize: Initializes Passport.
 * - passport.session: Provides session support for Passport.
 * - localStrategy: The local strategy for authenticating users.
 * - User.authenticate: Authenticates a user using the local strategy.
 * - User.serializeUser: Serializes the user object to store in the session.
 * - User.deserializeUser: Deserializes the user object from the session.
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* Static files
/**
 * Serves static files for the Express application.
 * - /: Serves static files from the "front-end/build" directory.
 * - /: Serves static files from the "public" directory.
 * - /images: Serves static files from the "public/image" directory.
 * - /assets: Serves static files from the "public/assets" directory.
 */
app.use(serveStatic(path.join(__dirname, "../front-end/build")));
app.use(serveStatic(path.join(__dirname, "public")));
app.use("/images", serveStatic(path.join(__dirname, "public/image")));
app.use("/assets", serveStatic(path.join(__dirname, "public/assets")));

//* Rate limiting
/**
 * Rate limiter middleware.
 *
 * @readonly Limit values according to your cpu and server capacity.
 * @param {Object} options - The rate limiter options.
 * @param {number} options.windowMs - The time window in milliseconds.
 * @param {number} options.max - The maximum number of requests allowed in the time window.
 */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100, // 100 req
});
app.use(limiter);

//* Routes
/**
 * Route configuration for the Express application.
 * - /admin: Routes for admin-related operations.
 * - /user: Routes for user-related operations.
 * - /auth: Routes for authentication-related operations.
 * - /api/admin: API routes for admin-related operations.
 * - /api/books: API routes for book-related operations.
 * - /api/user: API routes for user-related operations.
 * - /middleware: Middleware routes.
 */
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/admin", ApiAdmin);
app.use("/api/books", ApiBooks);
app.use("/api/user", ApiUser);
app.use("/api/auth", ApiAuth);
app.use("/middleware", ApiMiddleware);
app.use(suggestion);

//* Error handling middleware
/**
 * Error handling middleware for the Express application.
 * - Logs the error stack trace to the console.
 * - Sends a 500 status code and "Something broke!" message in the response.
 * - Calls the next middleware function.
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 * @returns {err} - Sends a 500 status code and "Something broke!" message in the response.
 * @console err - Logs the error stack trace to the console.
 */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//* Serve React App
/**
 * Serves the React application.
 * - This route will catch all requests that do not match any of the above routes.
 * - Sends the index.html file from the React build directory to the client.
 */
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server.
 * - Listens on the specified port (PORT).
 * - Logs a message to the console indicating that the server is running and on which port.
 */
app.listen(PORT, () => {
  logs.log("info", `Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
