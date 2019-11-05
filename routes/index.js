var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var User = require('../db').User;

var router = express.Router();


/* Create a user */
const createUser = async ({ userName, password }) => {
  return await User.create({ userName, password });
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
router.post('/user/register', async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await getUser({ userName });
    // If user is already exists
    if (user)
    {
      res.status(409).json({ msg: 'Username is already exists', user });
    }
    else {
      createUser({ userName, password }).then(user =>
        res.json({ user, msg: 'Account created successfully' })
      );
    }
  } catch (error) {
    return next(error);
  }
});

// authenticate passportJWT
router.post('/user/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      const { userName, password } = req.body;
      if (userName && password) {
          var user = await getUser({ userName });
          if (!user) {
              res.status(401).json({ msg: 'No user found', user });
          }
          if (user.password === password) {
              var payload = { userName: user.userName };
              var type = user.type;
              var imageUrl = user.imageUrl;
              console.log(imageUrl);
              var token = jwt.sign({user: payload}, '1612213_top_secret');
              return res.json({ token, userName, imageUrl, type });
          } else {
              res.status(401).json({ msg: 'Wrong password' });
          }
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Facebook
router.get('/account', ensureAuthenticated, function(req, res){
  console.log(req.user);
	 res.render('account', { user: req.user });
});

router.get('/auth/facebook', passport.authenticate('facebook',{scope:['email', 'user_photos']}));

router.get('/auth/facebook/callback', (req, res, next) => {
	passport.authenticate('facebook', { failureRedirect: '/' }, async (err, user) => {
    try {
      if (user) {
        var userName = user.userName;
        var imageUrl = user.imageUrl;
        var type = user.type; // facebook user
        return res.json({ userName, imageUrl, type});
      } else {
        res.status(401).json({ msg: 'No user found', user });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  //res.redirect('/')
}


module.exports = router;
