const express = require('express');
const { userTokenVerify } = require('../middlewares/auth');
const { userParamsTokenValidate } = require('../middlewares/user');
const router = express.Router();

/* GET home page. */
router.all('/', userParamsTokenValidate, userTokenVerify, function (req, res, next) {
  res.json({ title: 'Express', user: res.locals.user.email });
});

module.exports = router;