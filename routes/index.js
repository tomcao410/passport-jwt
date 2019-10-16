var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var User = require('../db').User;

var router = express.Router();


/* Create a user */
const createUser = async ({ email, password }) => {
  return await User.create({ email, password });
};

/* Get a list of all users */
const getAllUsers = async () => {
  return await User.findAll();
};

const getUser = async obj => {
  return await User.findOne({
  where: obj,
});
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get all users
router.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});
// register route
router.post('/user/register', function(req, res, next) {
  const { email, password } = req.body;
  createUser({ email, password }).then(user =>
    res.json({ user, msg: 'account created successfully' })
  );
});

// authenticate passportJWT
router.post('/user/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
          var user = await getUser({ email });
          if (!user) {
              res.status(401).json({ msg: 'No user found', user });
          }
          if (user.password === password) {
              var payload = { email: user.email };
              var token = jwt.sign({user: payload}, '1612213_top_secret');
              return res.json({ token });
          } else {
              res.status(401).json({ msg: 'Wrong password' });
          }
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});


module.exports = router;
