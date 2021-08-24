const express = require('express');
const { userTokenVerify } = require('../middlewares/auth');
const { userParamsTokenValidate } = require('../middlewares/user');

const router = express.Router();

/* GET home page. */
router.all('/', userParamsTokenValidate, userTokenVerify, (req, res) => {
  res.json({ title: 'Express', user: res.locals.user.email });
});

module.exports = router;
