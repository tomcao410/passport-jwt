var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user's profile */
router.get('/me', (req, res, next) => {
  res.json({
    message: 'Authorized',
    user: req.user,
    token: req.query.secret_token
  })
})

module.exports = router;
