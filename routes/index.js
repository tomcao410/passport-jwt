var express = require('express');
var router = express.Router();
var User = require('../db').User;

/* Create a user */
const createUser = async ({ email, password }) => {
  return await User.create({ email, password });
};

/* Get a list of all users */
const usersList = async () => {
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

module.exports = router;
