const express = require('express');
const { userTokenVerify } = require('../middlewares/auth');
const { userParamsTokenValidate } = require('../middlewares/user');
const router = express.Router();

/* GET home page. */
router.get('/', userParamsTokenValidate, userTokenVerify, function (req, res, next) {
  console.log(res.locals.user)
  res.json({ title: 'Express', user: res.locals.user.email });
});

module.exports = router;
