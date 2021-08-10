var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.all('/signin', function (req, res, next) {
  res.send('respond with a resource signin');
});

router.all('/signup', function (req, res, next) {
  res.send('respond with a resource signUp');
});

router.all('/logout', function (req, res, next) {
  res.send('respond with a resource logout');
});


module.exports = router;
