# Library Management System V2

## Following feature will be added in this repo

1. Server side caching
2. Server side validation
3. Scalable image upload
4. Wiring up CI/CD

## Techonologies used in this application

### Front-end

1. React.js
2. Bootstrap

### Back-end

1. Node.js
2. Express.js
3. MongoDB
4. Passport.js

## Install dependencies

Open git bash or command line tools at application file and run following npm command `npm install` if you have `package.json` file.
or
`npm install passport passport-local passport-local-mongoose body-parser connect-flash ejs express express-session method-override mongoose multer sharp uuid bcrypt --save`

### Install dev dependencies if needed

`npm install faker --save-dev`

## Run the application

- create a `.env` file in app directory
- add `SESSION_SECRET=<your session secret>`, `ADMIN_SECRET=<your admin secret>`, `DB_URL=<your mongodb url>` and `DB_NAME=<database_name>` into that file. or
- rename `.env.example` to `.env`
- run `npm run dev`
- App will open at [http://localhost:3000]

## Functionalitites

Whole app is divided into three modules.

- Admin
- User
- Browse books

### Admin module functionalities

- Sign up (This route is hidden. only accessible by typing the route manually and when admin log in)
- Login
- Logout
- Track all users activities
- Add books
- Update books
- Delete books
- Out of stock books
- Search books by category, title, author, ISBN
- Find users by firstname, lastname, email and username
- Delete user acount
- Restrict individual user if violate any terms and conditions
- Browse books showcase
- Update admin profile and password
- Add new admin
- Delete currently logged in admin profile
- Apporval and decline request books
- Accept and decline return request

### User module functionalities

- Sign up
- Login
- Logout
- Track own activities
- Request books
- Renew books
- Return books
- Browse books showcase
- Add, edit and delete comment on any books comment section
- Upload/Update profile picture
- Update profile and password
- Delete account

### Browse books module functionalities

This module can be accessed by anyone

- Show all books
- Find books on filtered search
