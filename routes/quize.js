const express = require('express');
const { userTokenVerify } = require('../middlewares/auth');
const { userParamsTokenValidate } = require('../middlewares/user');

const router = express.Router();

router.post('/new', userParamsTokenValidate, userTokenVerify, (req, res) => {
  res.json({ message: 'Should create new quize with validations' });
});

router.get('/all', (req, res) => {
  res.json({ message: 'Should send all quizes' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `should return id:${req.params.id} quize ` });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'shoould update exists quize' });
});

router.post('/:id/answer', (req, res) => {
  res.json({ message: 'should have answers' });
});

module.exports = router;
