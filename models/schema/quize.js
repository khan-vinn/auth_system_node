const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  invalidAnswers: {
    type: [String],
    required: true,
    minLength: 2,
  },
});
const formSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
});

const quizeSchema = mongoose.Schema({
  quize: {
    type: [querySchema],
  },
  form: {
    type: [formSchema],
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
});

module.exports = quizeSchema;
