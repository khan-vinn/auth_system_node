const mongoose = require('mongoose');

const UniqueAnswerSchema = mongoose.Schema({
  belongsTo: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const AnswerSchema = mongoose.Schema({
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quize',
    required: true,
  },
  answers: {
    type: [UniqueAnswerSchema],
    required: true,
    minLegth: 1,
  },
}, {
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
});

module.exports = AnswerSchema;
