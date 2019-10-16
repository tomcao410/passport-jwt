var express = require('express');
var router = express.Router();
var User = require('../db').User;

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
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

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

module.exports = router;
