const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
// Logs requests
const morgan = require('morgan');
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: 'Sam',
    favoriteMovies: []
  }
]

let movies = [
  {
    Title: 'The Batman',
    Description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator's plans become clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued the metropolis.",
    Directors: {
      Name: 'Matt Reeves',
      Bio: 'Matt Reeves (born April 27, 1966) is an American film director, producer and screenwriter. He first gained recognition for the WB drama series Felicity (1998–2002), which he co-created with J. J. Abrams. Reeves came to widespread attention for directing the hit monster film Cloverfield (2008).',
      Born: 'April 27, 1966 in Rockville Center, New York, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Adventure',
      Description: 'The adventure genre consists consist of protagonist/protagonists going on an epic journey, either personally or geographically. Often the protagonist has/have a mission and face/faces many obstacles in his/their way.'
    }
  },
  {
    Title: 'Batman vs Robin',
    Description: "Damian Wayne has a hard time accepting his father's no-killing rule, and soon starts to believe his destiny lies within a secret society.",
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'Justice League: War',
    Description: 'Superman , Wonder Woman, Batman and other superheroes join forces to save Earth from Darkseid.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
      Death: 'Still Alive',
    },
    Genre: {
      Name: 'Superhero',
      Description: 'The superhero genre is speculative fiction examining the adventures, personalities and ethics of costumed crime fighters known as superheroes, who often possess superhuman powers and battle similarly powered criminals known as supervillains.'
    }
  },
  {
    Title: 'Spider-man',
    Description: 'Spider-Man centers on student Peter Parker who, after being bitten by a genetically-altered spider, gains superhuman strength and the spider-like ability to cling to any surface. He vows to use his abilities to fight crime, coming to understand the words of his beloved Uncle Ben: "With great power comes great responsibility."',
    Directors: {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi, in full Samuel Marshall Raimi, (born October 23, 1959, Royal Oak, Michigan, U.S.), American film and television director, producer, and screenwriter whose inventive camera techniques and wry humour breathed life into the horror genre. Raimi began experimenting with filmmaking at a very early age.',
      Born: 'October 23, 1959 in Royal Oak, Michigan, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'Spider-man 2',
    Description: "'When a failed nuclear fusion experiment results in an explosion that kills his wife, Dr. Otto Octavius is transformed into Dr. Octopus, a cyborg with deadly metal tentacles. Doc Ock blames Spider-Man for the accident and seeks revenge. Meanwhile, Spidey's alter ego, Peter Parker, faces fading powers and self-doubt. Complicating matters are his best friend's hatred for Spider-Man and his true love's sudden engagement to another man.'",
    Directors:  {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi, in full Samuel Marshall Raimi, (born October 23, 1959, Royal Oak, Michigan, U.S.), American film and television director, producer, and screenwriter whose inventive camera techniques and wry humour breathed life into the horror genre. Raimi began experimenting with filmmaking at a very early age.',
      Born: 'October 23, 1959 in Royal Oak, Michigan, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title:'The Avengers',
    Description: "When Thor's evil brother, Loki, gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury, director of S.H.I.E.L.D., initiates a superhero recruitment effort to defeat the unprecedented threat to Earth. Joining Fury's team are Iron Man, Captain America, the Hulk, Thor, the Black Widow, and Hawkey.",
    Directors: {
      Name: 'Joss Whedon',
      Bio: 'Joss Whedon, byname of Joseph Hill Whedon, (born June 23, 1964, New York, New York, U.S.), American screenwriter, producer, director, and television series creator best known for his snappy dialogue and his original series featuring strong females in lead roles, including the cult TV hit Buffy the Vampire Slayer (1997–2003).',
      Born: 'June 23, 1964, New York City, New York, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'The Avengers: Age of Ultron',
    Description: 'When Tony Stark jump-starts a dormant peacekeeping program, things go terribly awry, forcing him, Thor, the Incredible Hulk and the rest of the Avengers to reassemble. As the fate of Earth hangs in the balance, the team is put to the ultimate test as they battle Ultron, a technological terror hell-bent on human extinction. Along the way, they encounter two mysterious and powerful newcomers, Pietro and Wanda Maximoff.',
    Directors: {
      Name: 'Joss Whedon',
      Bio: 'Joss Whedon, byname of Joseph Hill Whedon, (born June 23, 1964, New York, New York, U.S.), American screenwriter, producer, director, and television series creator best known for his snappy dialogue and his original series featuring strong females in lead roles, including the cult TV hit Buffy the Vampire Slayer (1997–2003).',
      Born: 'June 23, 1964, New York City, New York, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'Justice League Dark',
    Description: 'Batman forms Justice League Dark, a new team of dark arts specialists that is led by John Constantine. The team must unravel the mystery of a supernatural plague and contend with the rising, powerful villainous forces behind the siege.',
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'Batman: Bad Blood',
    Description: "Bruce Wayne is missing. Alfred covers for him while Nightwing and Robin patrol Gotham City in his stead. Meanwhile a new player, Batwoman, investigates Batman's disappearance.",
    Directors: {
      Name: 'Jay Oliva',
      Bio: 'Jay Oliva is an American storyboard artist, film producer and animated film director working at Lex and Otis animation studio.',
      Born: '1976, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
  {
    Title: 'Spider-Man: No Way Home',
    Description: "With Spider-Man's identity now revealed, our friendly neighborhood web-slinger is unmasked and no longer able to separate his normal life as Peter Parker from the high stakes of being a superhero. When Peter asks for help from Doctor Strange, the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    Directors: {
      Name: 'Jon Watts',
      Bio: "Jon Watts is an American filmmaker and screenwriter. He directed Cop Car and Clown before he was picked by Marvel and Sony to direct Spider-Man: Homecoming starring Tom Holland and Zendaya. It's success resulted in two sequels, Far from Home in 2019 and No Way Home in 2021. He was also picked by Marvel to direct a Fantastic Four reboot film following the failure of Josh Trank's Fant4stic, but dropped the directing role in April 2022.",
      Born: 'June 28, 1981 in Fountain, Colorado, USA',
      Death: 'Still Alive'
    },
    Genre: {
      Name: 'Action',
      Description: 'The action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
    }
  },
];

// New User
app.post('/users', (req, res) => {
  const newUser = req.body;
    if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser)
      res.status(201).json(newUser)
    } else {
      res.status(400).send('User needs names')
    }
});

// Update user Info
app.put('/users/:name', (req, res) => {
  const { name } = req.params;
  const updatedUser = req.body;

  let  user = users.find( user => user.name == name);

    if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
    } else {
      res.status(400).send('No such user')
    }
});

// Allow users to add movie to list
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find( user =>  user.id == id);

    if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s favoriteMovies list`);
    } else {
      res.status(400).send('No such user')
    }
});

// Allows user to remove movie from list
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find( user =>  user.id == id);

    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s favoriteMovies list`);
    } else {
      res.status(400).send('No such user')
    }
});

// Allow user to delete account/deregister
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find( user =>  user.id == id);

    if (user) {
      users = users.filter(user => user.id != id);
      res.status(200).send('User has been deleted');
    } else {
      res.status(400).send('No such user')
    }
});

// Returns Home page
app.get('/', (req, res) => {
  res.send('Hey! Welcome!');
});

// Returns list of movies and their data
app.get('/movies', (req, res) => {
  res.json(movies);
});

 // Returns movie data (description, genre, director) to user
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("no movie found")
    }
});

// Returns data about a genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send("no genre found")
    }
});

// Returns data about a director/directors
app.get('/movies/directors/:directorsName', (req, res) => {
  const { directorsName } = req.params;
  const directors = movies.find( movie => movie.Directors.Name === directorsName).Directors;
    if (directors) {
      res.status(200).json(directors);
    } else {
      res.status(400).send("no directors found")
    }
});

// Returns Documenation page
app.get('/documentation', (req, res) => {
res.sendFile('/movie_api/public/documentation.html');
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
