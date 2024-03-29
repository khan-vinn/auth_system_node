/* eslint-disable no-underscore-dangle */
const express = require('express');
const { userTokenVerify } = require('../middlewares/auth');
const { isQuizeLord, quizeFindWichBelongsToId } = require('../middlewares/quize');
const { userParamsTokenValidate } = require('../middlewares/user');
const { Quize, Anser } = require('../models');

const router = express.Router();

router.post('/new', userParamsTokenValidate, userTokenVerify, (req, res) => {
  const { title } = req.body;
  Quize.create({ title, belongsTO: res.locals.user._id })
    .then((doc) => res.json({ id: doc._id }))
    .catch((e) => res.json({ error: `${e.name}::${e.message}` }));
});

router.get('/all/:id?', userParamsTokenValidate, userTokenVerify, (req, res) => {
  const { id } = req.params;
  quizeFindWichBelongsToId(id && id.length > 0 ? id : res.locals.user._id)
    .then((docs) => res.json({ docs }))
    .catch((e) => res.json({ error: `${e.name} ${e.message}` }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Quize.findById(id)
    .then((doc) => res.json({ doc }))
    .catch((e) => res.json({ error: `${e.name}::${e.message}` }));
});

router.put('/:id', userParamsTokenValidate, userTokenVerify, isQuizeLord, (req, res) => {
  const { query, form } = req.body;

  const filterdForm = form.filter((e) => Object.keys(e).includes('question'));
  const filtredQuery = query.filter((e) => Object.keys(e).includes('question')
    && Object.keys(e).includes('answer')
    && Object.keys(e).includes('invalidAnswers')
    && e.invalidAnswers.length > 2);

  Quize.findByIdAndUpdate(
    { _id: res.locals.quize.id },
    { forms: filterdForm, queries: filtredQuery },
    { new: true },
  )
    .then((doc) => res.json({ doc }))
    .catch((e) => res.json({ error: `${e.name}::${e.message}` }));
});

router.post('/:id/answer', (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  const filtredAnsers = answers.filter((e) => Object.keys(e).includes('answer') && Object.keys(e).includes('belongsTo'));

  Anser.create({ belongsTo: id, answers: filtredAnsers })
    .then((doc) => res.json({ doc }))
    .catch((e) => res.json({ error: `${e.name}::${e.message}` }));
});

module.exports = router;
