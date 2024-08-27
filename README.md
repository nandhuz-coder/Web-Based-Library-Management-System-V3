# Library Management System V3
## Library Management System

This repository contains a comprehensive Library Management System that simplifies library operations, offering seamless book management, user authentication, and inventory tracking. Built using modern web technologies for efficiency and scalability.

## Features

The following features have been added to this repository:

1. Server-side caching
2. Server-side validation
3. Scalable image upload
4. API rendering

## Technologies Used

### Front-end

- React.js
- Bootstrap

### Back-end

- Node.js
- Express.js
- MongoDB
- Passport.js

## Installation

To install the dependencies, open Git Bash or command line tools in the application directory and run the following npm command:

```
npm install
```

If you need to install dev dependencies, run the following command:

```
npm install faker --save-dev
```

## Running the Application

To run the application:

1. Create a `.env` file in the app directory.
2. Add the following environment variables to the `.env` file:
    - `SESSION_SECRET=<your session secret>`
    - `ADMIN_SECRET=<your admin secret>`
    - `DB_URL=<your MongoDB URL>`
    - `DB_NAME=<database name>`
    - Alternatively, rename `.env.example` to `.env` and update the values.
3. Run the following command:
    ```
    npm run dev
    ```
4. The application will open at [http://localhost:3000](http://localhost:3000).

## Functionality

The application is divided into three modules:

### Admin Module

The admin module provides the following functionalities:

- Sign up (This route is hidden and only accessible by typing the route manually when an admin is logged in)
- Login
- Logout
- Track all user activities
- Add books
- Update books
- Delete books
- Out of stock books
- Search books by category, title, author, ISBN
- Find users by first name, last name, email, and username
- Delete user accounts
- Restrict individual users if they violate any terms and conditions
- Browse books showcase
- Update admin profile and password
- Add new admin
- Delete currently logged-in admin profile
- Approve and decline book requests
- Accept and decline return requests

### User Module

The user module provides the following functionalities:

- Sign up
- Login
- Logout
- Track own activities
- Request books
- Renew books
- Return books
- Browse books showcase
- Add, edit, and delete comments on any book's comment section
- Upload/update profile picture
- Update profile and password
- Delete account

### Browse Books Module

This module can be accessed by anyone and provides the following functionalities:

- Show all books
- Find books using filtered search

<!-- Open Graph Meta Tags -->
<meta property="og:title" content="Library Management System" />
<meta property="og:description" content="A comprehensive Library Management System that simplifies library operations, offering seamless book management, user authentication, and inventory tracking. Built using modern web technologies for efficiency and scalability." />
<meta property="og:url" content="https://github.com/nandhuz-coder/Library-Management-System" />
<meta property="og:image" content="https://mugshotbot.com/m/zjqQ3NIo">
<meta property="twitter:card" content="summary_large_image">

To run the application, use the following commands:

- For deployment: `npm start`
- For developer checks: `npm run dev`