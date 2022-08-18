const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const {check, validationResult} = require('express-validator');

const cors = require('cors');

// All origins
app.use(cors());

// Specific/limited origins
// let allowedOrigins = ['http://localhost:8080',];
// app.use(cors({
// origin: (origin, callback) => {
//   if(!origin) return callback(null, true);
//   if(allowedOrigins.indexOf(origin) === -1){
//     let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//     return callback(new Error(message ), false);
//   }
//   return callback(null, true);
// }
// }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// Logs requests
const morgan = require('morgan');
  app.use(morgan('common'));
  app.use(express.static('public'));
  app.use(bodyParser.json());

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// Local connection
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Online connection
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// GET - Home page
app.get('/', (req, res) => {
  res.send('Hey! Welcome!');
});

// GET - Documenation page
app.get('/documentation', (req, res) => {
res.sendFile('/movie_api/public/documentation.html');
});

// POST - Create new user/account 
app.post('/users', [
  check('Username', 'Username is required and must be minimum 5 characters long').isLength({ min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], 
  (req, res) => {
    let errors = validationResult(req);
      
      if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
      }
      
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'Already exist')
        } else {
          Users.create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
              .then((user) =>{res.status(201).json(user);
              })

                .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error: ' + error);
                })
          }
      })
        .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// PUT - Update user info
app.put('/users/:Username', 
  [
    check('Username', 'Username is required').isLength({ min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], 
  
  passport.authenticate('jwt', { session: false}), (req, res) => {
    let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
    
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE - User delete account/deregister
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST - Add movie to user's list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { favoriteMovies: req.params.MovieID }
   },
   { new: true },
   (err, updatedUser) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUser);
    }
  });
});

// DELETE - Remove movie from user's list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { favoriteMovies: req.params.MovieID }
   },
   { new: true },
   (err, updatedUser) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUser);
    }
  });
});

// GET - List of all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET - List of all movies
app.get('/movies', passport.authenticate('jwt', {session: false}),
(req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// GET - Data from a single movie
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      if (!movies) {
        res.status(404).send(req.params.Title + 'does not exist');
      } else {
        res.json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET - Data about a Genre
app.get('/movies/genre/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name})
  .then((movie) => {
    if (!movie) {
      res.status(404).send(req.params.Name + ' does not exist ');
    } else {
      res.json(movie.Genre);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})

// GET - Data about a Director/Directors
app.get('/movies/Directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Directors.Name': req.params.Name})
  .then((movie) => {
    if (!movie) {
      res.status(404).send(req.params.Name + ' does not exist ');
    } else {
      res.json(movie.Directors);
    }
    res.json(movie.Directors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh no, Error!');
});

// Listen for request
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
