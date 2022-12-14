require('dotenv').config();
const bodyParser = require('body-parser');
  express = require('express');
  morgan = require('morgan');
  uuid = require('uuid');
  app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
    Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
  Users = Models.User

mongoose.connect('mongodb+srv://Muser98:DBimake@moviesdb.e2abmls.mongodb.net/moviesDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const cors = require('cors');
// Allow requests from all origins
app.use(cors());

let auth = require('./auth.js')(app);

const passport = require('passport');
const { process_params } = require('express/lib/router/index.js');
require('./passport.js');

app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error');
});

/**
 * create a new user
 * We’ll expect JSON in this format
 * {
 * ID: Integer,
 * Username: String,
 * Password: String,
 * Email: String,
 * Birthday: Date
 * }
 * @returns user info as object
 * @param username
 * @param password
 * @param email
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 2}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(442).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{ res.status(201).json(user) })
          .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get user by username
/**
 * Get user data information
 * @requires passport
 * @param username
 * @returns user info as object
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/**
 * use Put for updating user info
 * We’ll expect JSON in this format
 * {
 * Username: String, (required)
 * Password: String, (required)
 * Email: String, (required)
 * Birthday: Date
 * }
 * @param username
 * @param password
 * @param email
 * @param birthday
 * @returns user info as object
 * @requires passport
 * */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
/**
 * Post a movie to user's favorite movies list
 * @param movie id
 * @param username
 * @returns updated user info as object
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// Remove a movie from user's favorite movie list
/**
 * Delete a movie from user's favorite movies list
 * @param username
 * @param movie id
 * @returns updated user info as object
 * @requires passport
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// Delete a user by username
/**
 * delete user from database
 * @returns status
 * @param username
 * @requires passport
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(201).send(req.params.Username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all movies
/**
 * Get all movies from database
 * @returns all movies
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get one movie by title
/**
 * get one movie
 * @param movie title
 * @returns movie info as an object
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    if (!movie) {
      res.status(400).send(req.params.Title + ' was not found');
    } else {
      res.status(201).json(movie);
    }
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

// Get genre and description
/**
 * get gnere of a movie
 * @param genre name
 * @returns genre info as an object
 */
app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
  .then((genre) => {
    if (!genre) {
      res.status(400).send(req.params.Genre + ' was not found');
    } else {
      res.status(201).json(genre.Genre);
    }
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

// Get director and bio
/**
 * get director of a movie
 * @param director name
 * @returns director info as an object
 */
app.get('/movies/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Director })
  .then((directors) => {
    if (!directors) {
      res.status(400).send(req.params.Director + ' was not found');
    } else {
      res.status(201).json(directors.Director);
    }
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
