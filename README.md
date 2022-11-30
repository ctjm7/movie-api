# Movie API

## Description
The server-side component of a “movies” web application. The web application provides users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies.

## Purpose of the App
To create a REST API for an application that interacts with a database that stores data about different movies. This is to teach me as web development student about a well-designed REST API and architected architected database built using JavaScript, Node.js, Express, and MongoDB. The REST API will be accessed via commonly used HTTP methods like GET and POST. These methods (CRUD) are used to retrieve data from the database and store that data in a non-relational way.

## Key Features
* Return a list of ALL movies to the user
* Return data (description, genre, director, and image URL about a single movie by title to the user
* Return data about a genre (description) by name/title (e.g., “Thriller”)
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a movie to their list of favorites
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister

## User Stories
* As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
* As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Tech Used
Node.js, Express, JavaScript, MongoDB, Mongoose, Postman, Heroku, JWT(token-based) authentication

## Dependencies
``` "bcrypt": "^5.0.1",
    "body-parser": "^1.20.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.1",
    "express": "^4.18.1",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "mongoose": "^6.5.2",
    "morgan": "^1.10.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "uuid": "^8.3.2"

  "devDependencies":
    "eslint": "^8.21.0",
    "nodemon": "^2.0.19"
