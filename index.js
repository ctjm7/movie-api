const express = require('express');
  morgan = require('morgan');

const app = express();

let topMovies = [
  {
    title:'When Harry Met Sally'
  },
  {
    title:'The Philadelphia Story'
  },
  {
    title:'Pride and Predjudice'
  },
  {
    title:'The Lakehouse'
  },
  {
    title:'The Proposal'
  },
  {
    title:'To Catch a Thief'
  },
  {
    title:'Casablanca'
  },
  {
    title:'Vertigo'
  },
  {
    title:`Breakfast at Tiffany's`
  },
  {
    title:'Rear Window'
  }
];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  let responseText = '<h1>See you at the movies!</h1>';
  res.send(responseText);
});

app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error');
});

app.listen(8080, () => {
  console.log('This app is running on port 8080');
});
