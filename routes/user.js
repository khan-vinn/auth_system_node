const express = require('express');
const bcrypt = require("bcrypt")
const { UserParamsValidate, userParamsTokenValidate } = require('../middlewares/user');
const { User } = require('../models');
const { generateAccessToken, decodeToken, userTokenVerify } = require('../middlewares/auth');
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
  (req, res) => {
    const { email, password } = req.body
    User.findOne({ email })
      .then(user => {
        if (!user) {
          throw new Error("Don't find user")
        } else {
          return bcrypt.compare(password, user.password)
        }
      })
      .then((message) => {
        if (!message) {
          throw new Error("Password is incorrected")
        } else {
          return generateAccessToken({ email, userAgent: req.get('User-Agent') })
        }
      })
      .then((token) => {
        return User.findOneAndUpdate({ email }, { token }, { new: true })
      })
      .then((user) => res.status(200).json({ code: 200, token: user.token }))
      .catch((e) => res.status(500).json({ code: 500, message: `${e.name} :: ${e.message}` }))
  });

router.all('/signup',
  UserParamsValidate,
  (req, res) => {
    const { email, password } = req.body
    let savedToken;
    User.findOne({ email })
      .then(user => {
        if (user) {
          throw new Error("try another email")
        } else {
          return generateAccessToken({ email, userAgent: req.get('User-Agent') })
        }
      })
      .then((token) => {
        savedToken = token
        return bcrypt.hash(password, 12)
      })
      .then((hash) => User.create({ email, token: savedToken, password: hash }))
      .then((user) => res.status(200).json({ code: 200, token: user.token }))
      .catch((e) => res.status(500).json({ code: 500, message: `${e.name} :: ${e.message}` }))
  });

router.all('/signout', userParamsTokenValidate, userTokenVerify, function (req, res) {
  const { user } = res.locals.user
  User.findOneAndUpdate({ email: user.email }, { token: "" })
    .then(() => res.status(200).json({ code: 200, message: "OK" }))
    .catch((e) => res.status(500).json({ code: 500, message: `${e.name} :: ${e.message}` }))
});


module.exports = router;
