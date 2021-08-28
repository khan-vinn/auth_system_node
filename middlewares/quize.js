/* eslint-disable no-underscore-dangle */
const { Quize } = require('../models');

async function quizeFindWichBelongsToId(id) {
  const response = await Quize.find({ belongsTO: id });
  return response;
}
async function isQuizeLord(req, res, next) {
  const { id } = req.params;
  const quize = await Quize.findById(id);
  if (quize && quize.belogsTo === res.locals.isQuizeLord._id) {
    res.locals.quize = quize;
    return next();
  }
  return res.json({ message: 'is it no your quize' });
}

module.exports = { isQuizeLord, quizeFindWichBelongsToId };
