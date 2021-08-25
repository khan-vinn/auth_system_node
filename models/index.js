const mongoose = require('mongoose');
const AnswerSchema = require('./schema/answer');
const QuizeSchema = require('./schema/quize');
const ResumeSchema = require('./schema/resume');
const UserSchema = require('./schema/user');

const User = mongoose.model('User', UserSchema);
const Quize = mongoose.model('Quize', QuizeSchema);
const Resume = mongoose.model('Resume', ResumeSchema);
const Anser = mongoose.model('Answer', AnswerSchema);

module.exports = {
  User, Quize, Resume, Anser,
};
