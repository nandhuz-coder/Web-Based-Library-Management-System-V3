//*Import packages
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const methodOverride = require("method-override");
const path = require("path");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const compression = require("compression");
const passport = require("passport");
const localStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const User = require("./models/user");

//*Import Routes
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

//*Api Routes
const ApiAdmin = require("./Api/Api-Admin");
const ApiBooks = require("./Api/Api-Book");
const ApiUser = require("./Api/Api-user");
const ApiMiddleware = require("./middleware/middleware");

// Uncomment for initial seeding
//const seedMail = require("./dev/seedMail");
//seedMail(1);
// const Seed = require("./dev/seed");
// const seedUsers = require("./dev/seeduser");
// Seed(555);
// seedUsers(223);

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();

// App configuration
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Database configuration
mongoose
  .connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

// Session configuration with connect-mongo
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  collectionName: "sessions",
  autoRemove: "interval",
  autoRemoveInterval: 7 * 24 * 60, // 7 days
});

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/images", express.static(path.join(__dirname, "public/image")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 min
  max: 100, //100 req
});
app.use(limiter);

//* Routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use(ApiAdmin);
app.use(ApiBooks);
app.use(ApiUser);
app.use("/middleware", ApiMiddleware);

// Serve React App
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
