// importing libraries
const passport = require("passport"),
  bcrypt = require("bcrypt");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// importing models
const User = require("../models/user");

exports.postAdminSignUp = async (req, res, next) => {
  try {
    if (req.body.adminCode === process.env.ADMIN_SECRET) {
      const newAdmin = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        isAdmin: true,
      });

      await User.register(newAdmin, req.body.password);
      await passport.authenticate("local")(req, res, () => {
        res.json({ success: "Admin registration successful" });
      });
    } else {
      res.json({ error: "Secret code does not match!" });
    }
  } catch (err) {
    console.error(err);
    if (err.name === "UserExistsError") {
      req.json({ error: "Username or email already exists." });
    } else {
      req.json({ error: "Failed to register admin. Please try again later." });
    }
    res.json({ error: "Failed to register admin" });
  }
};

exports.getUserLogout = async (req, res, next) => {
  req.logout(async function (err) {
    if (err) return next(err);
    if (req.session) await req.session.destroy();
    res.json(true);
  });
};

exports.postUserSignUp = async (req, res, next) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
      password: await bcrypt.hash(req.body.password, 10),
    });

    const user = await User.register(newUser, req.body.password);
    await passport.authenticate("local")(req, res, () => {
      res.json({ success: `Hello, ${user.username}  Welcome` });
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error:
        "Given info matches someone registered as User. Please provide different info for registering as User",
    });
  }
};
