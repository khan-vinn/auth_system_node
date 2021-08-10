const express = require('express');
const { UserParamsValidate } = require('../middlewares/user');
const { User } = require('../models');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    "status": 200,
    "message": "respond with a resource",
    "ip": req.ip
  });
});

router.all('/signin',
  UserParamsValidate,
  (req, res, next) => {
    res.json({
      "status": 200,
      "message": "respond with a resource signIn"
    });
  });

router.all('/signup',
  UserParamsValidate,
  (req, res, next) => {
    res.json({
      "status": 200,
      "message": "respond with a resource signUp"
    });
  });

router.all('/signout', function (req, res, next) {
  res.json({
    "status": 200,
    "message": "respond with a resource signout"
  });
});


module.exports = router;
