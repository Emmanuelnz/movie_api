const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const {check, validationResult} = require('express-validator');

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080',];
app.use(cors({
origin: (origin, callback) => {
  if(!origin) return callback(null, true);
  if(allowedOrigins.indexOf(origin) === -1){
    let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
    return callback(new Error(message ), false);
  }
  return callback(null, true);
}
}));

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

// Local
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Online
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let users = [
]

let movies = [
  {
    Title: 'The Batman',
    Description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator\'s plans become clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued the metropolis.',
    Directors: {
      Name: 'Matt Reeves',
      Bio: 'Matt Reeves (born April 27, 1966) is an American film director, producer and screenwriter. He first gained recognition for the WB drama series Felicity (1998–2002), which he co-created with J. J. Abrams. Reeves came to widespread attention for directing the hit monster film Cloverfield (2008).',
      Born: 'April 27, 1966 in Rockville Center, New York, USA',
    },
    Genre: {
      Name: 'Adventure',
      Description: 'The adventure genre consists consist of protagonist/protagonists going on an epic journey, either personally or geographically. Often the protagonist has/have a mission and face/faces many obstacles in their way.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg"
  },
  {
    Title: 'Batman vs Robin',
    Description: 'Damian Wayne has a hard time accepting his father\'s no-killing rule, and soon starts to believe his destiny lies within a secret society.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BMjI0ODY2MDE5Nl5BMl5BanBnXkFtZTgwMTk0NTcyNTE@._V1_.jpg"
  },
  {
    Title: 'Justice League: War',
    Description: 'Superman , Wonder Woman, Batman and other superheroes join forces to save Earth from Darkseid.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
    },
    Genre: {
      Name: 'Superhero',
      Description: 'The superhero genre is speculative fiction examining the adventures, personalities and ethics of costumed crime fighters known as superheroes, who often possess superhuman powers and battle similarly powered criminals known as supervillains.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BYzA4ZjA3NzUtNDhjNS00OGNlLWI4ZWUtYzhkMmJiZDU2ZWExXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
  },
  {
    Title: 'Spider-man',
    Description: 'Spider-Man centers on student Peter Parker who, after being bitten by a genetically-altered spider, gains superhuman strength and the spider-like ability to cling to any surface. He vows to use his abilities to fight crime, coming to understand the words of his beloved Uncle Ben: "With great power comes great responsibility."',
    Directors: {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi, in full Samuel Marshall Raimi, (born October 23, 1959, Royal Oak, Michigan, U.S.), American film and television director, producer, and screenwriter whose inventive camera techniques and wry humour breathed life into the horror genre. Raimi began experimenting with filmmaking at a very early age.',
      Born: 'October 23, 1959 in Royal Oak, Michigan, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg"
  },
  {
    Title: 'Spider-man 2',
    Description: 'When a failed nuclear fusion experiment results in an explosion that kills his wife, Dr. Otto Octavius is transformed into Dr. Octopus, a cyborg with deadly metal tentacles. Doc Ock blames Spider-Man for the accident and seeks revenge. Meanwhile, Spidey\'s alter ego, Peter Parker, faces fading powers and self-doubt. Complicating matters are his best friend\'s hatred for Spider-Man and his true love\'s sudden engagement to another man.',
    Directors:  {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi, in full Samuel Marshall Raimi, (born October 23, 1959, Royal Oak, Michigan, U.S.), American film and television director, producer, and screenwriter whose inventive camera techniques and wry humour breathed life into the horror genre. Raimi began experimenting with filmmaking at a very early age.',
      Born: 'October 23, 1959 in Royal Oak, Michigan, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BMzY2ODk4NmUtOTVmNi00ZTdkLTlmOWYtMmE2OWVhNTU2OTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"
  },
  {
    Title:'The Avengers',
    Description: 'When Thor\'s evil brother, Loki, gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury, director of S.H.I.E.L.D., initiates a superhero recruitment effort to defeat the unprecedented threat to Earth. Joining Fury\'s team are Iron Man, Captain America, the Hulk, Thor, the Black Widow, and Hawkey.',
    Directors: {
      Name: 'Joss Whedon',
      Bio: 'Joss Whedon, byname of Joseph Hill Whedon, (born June 23, 1964, New York, New York, U.S.), American screenwriter, producer, director, and television series creator best known for his snappy dialogue and his original series featuring strong females in lead roles, including the cult TV hit Buffy the Vampire Slayer (1997–2003).',
      Born: 'June 23, 1964, New York City, New York, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    Title: 'Avengers: Age of Ultron',
    Description: 'When Tony Stark jump-starts a dormant peacekeeping program, things go terribly awry, forcing him, Thor, the Incredible Hulk and the rest of the Avengers to reassemble. As the fate of Earth hangs in the balance, the team is put to the ultimate test as they battle Ultron, a technological terror hell-bent on human extinction. Along the way, they encounter two mysterious and powerful newcomers, Pietro and Wanda Maximoff.',
    Directors: {
      Name: 'Joss Whedon',
      Bio: 'Joss Whedon, byname of Joseph Hill Whedon, (born June 23, 1964, New York, New York, U.S.), American screenwriter, producer, director, and television series creator best known for his snappy dialogue and his original series featuring strong females in lead roles, including the cult TV hit Buffy the Vampire Slayer (1997–2003).',
      Born: 'June 23, 1964, New York City, New York, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_.jpg"
  },
  {
    Title: 'Justice League Dark',
    Description: 'Batman forms Justice League Dark, a new team of dark arts specialists that is led by John Constantine. The team must unravel the mystery of a supernatural plague and contend with the rising, powerful villainous forces behind the siege.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BOTEyZmEwNzktOGNiOC00NzhhLTk1NTItODIwOTc5ZGNkZjYzXkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg"
  },
  {
    Title: 'Batman: Bad Blood',
    Description: 'Bruce Wayne is missing. Alfred covers for him while Nightwing and Robin patrol Gotham City in his stead. Meanwhile a new player, Batwoman, investigates Batman\'s disappearance.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BZWZiZmZhYmQtYjVkZi00MWIzLWEzM2MtYzhkNjliNzc2MTMwL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg"
  },
  {
    Title: 'Spider-Man: No Way Home',
    Description: 'With Spider-Man\'s identity now revealed, our friendly neighborhood web-slinger is unmasked and no longer able to separate his normal life as Peter Parker from the high stakes of being a superhero. When Peter asks for help from Doctor Strange, the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.',
    Directors: {
      Name: 'Jon Watts',
      Bio: 'Jon Watts is an American filmmaker and screenwriter. He directed Cop Car and Clown before he was picked by Marvel and Sony to direct Spider-Man: Homecoming starring Tom Holland and Zendaya. It\'s success resulted in two sequels, Far from Home in 2019 and No Way Home in 2021. He was also picked by Marvel to direct a Fantastic Four reboot film following the failure of Josh Trank\'s Fant4stic, but dropped the directing role in April 2022.',
      Born: 'June 28, 1981 in Fountain, Colorado, USA',
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg"
  },
];

// Returns Home page
app.get('/', (req, res) => {
  res.send('Hey! Welcome!');
});

// Returns Documenation page
app.get('/documentation', (req, res) => {
res.sendFile('/movie_api/public/documentation.html');
});

// New user - using mongoose
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
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
            .then((user) =>{res.status(201).json(user) })
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

// Update user info
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({ min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false}), (req, res) => {
    let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
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

// Allow user to delete account/deregister
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

// Allow users to add movie to list
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

// Allow user to remove a movie from list
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

// Returns a list of all users
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

// Returns list of all movies - with mongoose
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Returns data (description, genre, director) from a single movie
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Returns data about a genre
app.get('/movies/genre/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name})
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})

// Returns data about a director/directors
app.get('/movies/Directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Directors.Name': req.params.Name})
  .then((movie) => {
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
