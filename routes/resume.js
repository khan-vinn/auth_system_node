const express = require('express');

const router = express.Router();

router.get('/all', (req, res) => {
  res.json({ message: 'Should return all created resume' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'should return resume with this id' });
});

router.post('/new', (req, res) => {
  res.json({ message: 'should create new resume' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'should update exists resume' });
});

module.exports = router;
