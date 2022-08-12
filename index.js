const bodyParser = require('body-parser');
  express = require('express');
  morgan = require('morgan');
  uuid = require('uuid');
  app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error');
});

let users = [
  {
    "id": 1,
    "name": "Mary",
    "favoriteMovies": []
  },
  {
    "id": 2,
    "name": "Joe",
    "favortieMovies": [
      "Pride and Prejudice"
  ]
  },
  {
    "id": 3,
    "name": "Bob",
    "favoriteMovies": []
  }
];

let movies = [
  {
    "Title":"When Harry Met Sally",
     "Description":"Harry and Sally have known each other for years, and are very good friends, but they fear sex would ruin the friendship.",
     "Genre": {
       "Name":"Comedy"
     },
     "Director": {
       "Name":"Rob Reiner",
       "Bio":"Robert Reiner was born in New York City, to Estelle Reiner (née Lebost) and Emmy-winning actor, comedian, writer, and producer Carl Reiner.In 1987, with these successful box-office movies under his belt, Reiner founded his own production company, Castle Rock Entertainment; along with Martin Shafer, Andrew Scheinman, Glenn Padnick, and Alan Horn. Under Castle Rock Entertainment, he went to direct Oscar-nominated films When Harry Met Sally, Misery, and A Few Good Men. Reiner has credited former co-star Carroll O'Connor in helping him get into the directing business, showing Reiner the ropes."
     },
     "ImageURL":"https://www.imdb.com/title/tt0098635/mediaviewer/rm1579924224/?ref_=tt_ov_i",
     "Year":"1989"
  },
  {
    "Title":"The Philadelphia Story",
    "Description":"When a rich woman's ex-husband and a tabloid-type reporter turn up just before her planned remarriage, she begins to learn the truth about herself.",
     "Genre": {
       "Name":"Comedy"
     },
     "Director": {
       "Name":"George Cukor",
       "Bio":"George Cukor was an American film director of Hungarian-Jewish descent, better known for directing comedies and literary adaptations. He once won the Academy Award for Best Director, and was nominated other four times for the same Award."
     },
     "ImageURL":"https://www.imdb.com/title/tt0032904/mediaviewer/rm3239186176/?ref_=tt_ov_i",
     "Year":"1940"
  },
  {
    "Title":"Pride and Predjudice",
    "Description":"Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class. Can each overcome their own pride and prejudice?",
     "Genre": {
       "Name":"Drama"
     },
     "Director": {
       "Name":"Joe Wright",
       "Bio":"Joe Wright is an English film director. He is best known for Pride & Prejudice (2005), Atonement (2007), Anna Karenina (2012), and Darkest Hour (2017)."
     },
     "ImageURL":"https://www.imdb.com/title/tt0414387/mediaviewer/rm1343528192/?ref_=tt_ov_i",
     "Year":"2005"
  }
];

app.post('/users',(req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  }
  else {
    res.status(400).send('user needs name');
  }
});

app.put('/users/:id',(req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;
  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  }
  else {
    res.status(400).send('user not found');
  }
});

app.post('/users/:id/:movieTitle',(req, res) => {
  const {id, movieTitle} = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}`);
  }
  else {
    res.status(400).send('user not found');
  }
});

app.delete('/users/:id/:movieTitle',(req, res) => {
  const {id, movieTitle} = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}`);
  }
  else {
    res.status(400).send('user not found');
  }
});

app.delete('/users/:id',(req, res) => {
  const {id} = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  }
  else {
    res.status(400).send('user not found');
  }
});

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  }
  else {
    res.status(400).send('movie not found');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  }
  else {
    res.status(400).send('genre not found');
  }
});

app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  }
  else {
    res.status(400).send('director not found');
  }
});

app.listen(8080, () => {
  console.log('This app is running on port 8080');
});
