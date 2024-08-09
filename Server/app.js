const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  session = require("express-session"),
  cors = require("cors"),
  passport = require("passport"),
  multer = require("multer"),
  uid = require("uid"),
  path = require("path"),
  methodOverride = require("method-override"),
  localStrategy = require("passport-local"),
  MongoStore = require("connect-mongodb-session")(session),
  flash = require("connect-flash"),
  bodyParser = require("body-parser"),
  User = require("./models/user"),
  userRoutes = require("./routes/users"),
  adminRoutes = require("./routes/admin"),
  authRoutes = require("./routes/auth"),
  ApiAdmin = require("./Api/Api-Admin"),
  ApiBooks = require("./Api/Api-Book"),
  ApiUser = require("./Api/Api-user"),
  ApiMiddleware = require("./middleware/middleware");

// const Seed = require("./dev/seed");
//const seedUsers = require("./dev/seeduser");
// uncomment below line for first time to seed database;
// Seed(555);
//seedUsers(223);

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// app config
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// db config
mongoose
  .connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

// PASSPORT CONFIGURATION

const store = new MongoStore({
  uri: process.env.DB_URL,
  collection: "sessions",
  databaseName: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure image file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/image/user-profile");
  },
  filename: (req, file, cb) => {
    cb(null, `${uid()}-${file.originalname}`);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "public/image")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(ApiAdmin);
app.use(ApiBooks);
app.use(ApiUser);
app.use(ApiMiddleware);

// Serve React App
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../front-end/build", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
