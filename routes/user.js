const express = require('express');
const bcrypt = require("bcrypt")
const { UserParamsValidate } = require('../middlewares/user');
const { User } = require('../models');
const { generateAccessToken, decodeToken } = require('../middlewares/auth');
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
    const { email, password, username } = req.body
    User.findOne({ email, username })
      .then((user) => {
        if (!user) {
          throw new Error("Dont find username")
        } else {
          bcrypt.compare(user.pasword, password)
        }
      })
      .then((message) => {
        if (!message) {
          throw new Error("Password is incorrected")
        } else {
          return generateAccessToken({ email, userAgent: req.get('User-Agent') })
        }
      }).then((token) => User.findOneAndUpdate({ email }, { token }))
      .then((user) => res.code(200).json({ code: 200, token: user.token }))
      .cath((e) => res.code(500).json({ code: 500, message: `${e.name}::${e.message}` }))
  });

router.all('/signup',
  UserParamsValidate,
  (req, res, next) => {
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
      .then((user) => res.code(200).json({ code: 200, token: user.token }))
      .catch((e) => res.code(500).json({ code: 500, message: `${e.name}::${e.message}` }))
  });

router.all('/signout', function (req, res, next) {
  const { token } = req.body
  decodeToken(token)
    .then(user => User.findOneAndRemove({ email: user.email, token }))
    .then(() => res.code(200).json({ code: 200, message: "OK" }))
    .catch((e) => res.code(500).json({ code: 500, message: `${e.name}::${e.message}` }))
});


module.exports = router;
