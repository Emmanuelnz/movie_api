const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

  require('./passport');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //Username being encoded in the JWT
    expiresIn: '7d', //Time token will take to expire
    algorithm: 'HS256', //algorithm used to “sign” or encode the values of the JWT
  });
};

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
       req.login(user, { session: false }, (error) => {
         if (error) {
           res.send(error);
         }
         let token = generateJWTToken(user.toJSON());
         return res.json({ user, token });
       });
    })(req, res);
  });
};
