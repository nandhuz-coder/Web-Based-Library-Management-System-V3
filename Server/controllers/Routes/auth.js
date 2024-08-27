// importing libraries
const passport = require("passport");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// importing models
const User = require("../../models/user");

/**
 * Creates a new admin user.
 *
 * @param {string} username - The username of the admin user.
 * @param {string} email - The email of the admin user.
 * @returns {User} The newly created admin user.
 *
 * Workflow:
 * 1. Check if the provided admin code matches the secret code stored in environment variables.
 * 2. If the admin code matches, create a new User instance with the provided username, email, and set isAdmin to true.
 * 3. Register the new admin user with the provided password.
 * 4. Authenticate the user using passport's "local" strategy.
 * 5. If authentication is successful, send a JSON response indicating successful admin registration.
 * 6. If the admin code does not match, send a JSON response indicating the error.
 * 7. Handle any errors that occur during the process and log them to the console.
 * 8. If the error is a UserExistsError, send a JSON response indicating that the username or email already exists.
 * 9. For any other errors, send a JSON response indicating a failure to register the admin.
 */
exports.postAdminSignUp = async (req, res, next) => {
  try {
    // Step 1: Check if the provided admin code matches the secret code stored in environment variables
    if (req.body.adminCode === process.env.ADMIN_SECRET) {
      // Step 2: Create a new User instance with the provided username, email, and set isAdmin to true
      const newAdmin = new User({
        username: req.body.username,
        email: req.body.email,
        isAdmin: true,
      });

      // Step 3: Register the new admin user with the provided password
      await User.register(newAdmin, req.body.password);

      // Step 4: Authenticate the user using passport's "local" strategy
      await passport.authenticate("local")(req, res, () => {
        // Step 5: If authentication is successful, send a JSON response indicating successful admin registration
        res.json({ success: "Admin registration successful" });
      });
    } else {
      // Step 6: If the admin code does not match, send a JSON response indicating the error
      res.json({ error: "Secret code does not match!" });
    }
  } catch (err) {
    // Step 7: Handle any errors that occur during the process and log them to the console
    console.error(err);

    // Step 8: If the error is a UserExistsError, send a JSON response indicating that the username or email already exists
    if (err.name === "UserExistsError") {
      res.json({ error: "Username or email already exists." });
    } else {
      // Step 9: For any other errors, send a JSON response indicating a failure to register the admin
      res.json({ error: "Failed to register admin. Please try again later." });
    }
  }
};

/**
 * Logs out the current user.
 *
 * @returns {boolean} Returns true if the user is successfully logged out.
 *
 * Workflow:
 * 1. Call req.logout to log out the current user.
 * 2. If an error occurs during logout, pass the error to the next middleware.
 * 3. If the user has an active session, destroy the session.
 * 4. Send a JSON response indicating successful logout.
 */
exports.getUserLogout = async (req, res, next) => {
  req.logout(async function (err) {
    // Step 2: If an error occurs during logout, pass the error to the next middleware
    if (err) return next(err);

    // Step 3: If the user has an active session, destroy the session
    if (req.session) await req.session.destroy();

    // Step 4: Send a JSON response indicating successful logout
    res.json(true);
  });
};

/**
 * Creates a new user object.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.gender - The gender of the user.
 * @param {string} req.body.address - The address of the user.
 * @returns {User} The newly created user object.
 *
 * Workflow:
 * 1. Extract user details from the request body.
 * 2. Create a new User instance with the extracted details.
 * 3. Register the new user with the provided password.
 * 4. Authenticate the user using passport's "local" strategy.
 * 5. If authentication is successful, send a JSON response indicating successful registration.
 * 6. Handle any errors that occur during the process and log them to the console.
 * 7. If an error occurs, send a JSON response indicating the failure to register the user.
 */
exports.postUserSignUp = async (req, res, next) => {
  try {
    // Step 1: Extract user details from the request body
    const { firstName, lastName, username, email, gender, address, password } =
      req.body;

    // Step 2: Create a new User instance with the extracted details
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      gender,
      address,
    });

    // Step 3: Register the new user with the provided password
    const user = await User.register(newUser, password);

    // Step 4: Authenticate the user using passport's "local" strategy
    await passport.authenticate("local")(req, res, () => {
      // Step 5: If authentication is successful, send a JSON response indicating successful registration
      res.json({ success: `Hello, ${user.username}  Welcome` });
    });
  } catch (err) {
    // Step 6: Handle any errors that occur during the process and log them to the console
    console.log(err);

    // Step 7: If an error occurs, send a JSON response indicating the failure to register the user
    return res.json({
      error:
        "Given info matches someone registered as User. Please provide different info for registering as User",
    });
  }
};
