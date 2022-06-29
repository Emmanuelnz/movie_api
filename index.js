const express = require('express');
const app = express();
// Logs requests
const morgan = require('morgan');
app.use(morgan('common'));

let topMovies = [
  {
    title: 'Spirit: Stallion of the Cimarron '
  },
  {
    title: 'Batman vs Robin'
  },
  {
    title: 'Justice League: Throne of Atlantis'
  },
  {
    title: 'Spider-man'
  },
  {
    title: 'Spider-man 2'
  },
  {
    title:'The Avengers'
  },
  {
    title:'The Avengers: Age of Ultron'
  },
  {
    title:'Justice League Dark'
  },
  {
    title:'Batman: Bad Blood'
  },
  {
    title:'Batman: Hush'
  },
];

app.get('/', (req, res) => {
  res.send('Hey! Welcome!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/documentation', (req, res) => {
  res.sendFile('/movie_api/documentation.html');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh no, Error!');
});

// Listen for request
app.listen(8080, () => {
  console.log('App is runnning on port 8080.');
});
