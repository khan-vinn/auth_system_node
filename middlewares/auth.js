require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function generateAccessToken(data) {
  const res = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '21d' });
  return res;
}

async function decodeToken(token) {
  const res = await jwt.decode(token);
  return res;
}
async function verifyToken(data) {
  const res = await jwt.verify(data, process.env.JWT_SECRET);
  return res;
}

function updateUserToken(req, res, next) {
  const { token } = req.body;
  User.findOne({ token })
    .then((user) => {
      if (!user) {
        throw new Error('dont find user');
      } else {
        return generateAccessToken({ email: user.email, userAgent: req.get('User-Agent') });
      }
    })
    .then((newToken) => User.findOneAndUpdate({ token }, { token: newToken }, { new: true }))
    .then((user) => {
      res.locals.user = user;
      return next();
    })
    .cath((e) => res.status(500).json({ status: 500, message: `${e.name} :: ${e.message}` }));
}

function userTokenVerify(req, res, next) {
  const { token } = req.body;
  verifyToken(token)
    .then((data) => {
      if (data.userAgent !== req.get('User-Agent') && Number(data.exp) * 1000 > Number(new Date())) {
        throw new Error('invalid token, please update');
      } else {
        return User.findOne({ email: data.email });
      }
    })
    .then((user) => {
      if (!user) {
        throw new Error("don't find user");
      } else if (user.token.includes(token)) {
        res.locals.user = user;
        return next();
      } else {
        throw new Error('token is ancient');
      }
    })
    .catch((e) => res.status(403).json({ status: 403, message: `${e.name} :: ${e.message}` }));
}

module.exports = {
  generateAccessToken, userTokenVerify, decodeToken, updateUserToken,
};
