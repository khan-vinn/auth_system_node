const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const querySchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => nanoid(6),
  },
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
  id: {
    type: String,
    required: true,
    default: () => nanoid(6),
  },
  question: {
    type: String,
    required: true,
  },
});

const quizeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  queries: {
    type: [querySchema],
  },
  forms: {
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
