const mongoose = require('mongoose');
const QuizeSchema = require('./schema/quize');
const ResumeSchema = require('./schema/resume');
const UserSchema = require('./schema/user');

const User = mongoose.model('User', UserSchema);
const Quize = mongoose.model('Quize', QuizeSchema);
const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = { User, Quize, Resume };
