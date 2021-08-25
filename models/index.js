const mongoose = require('mongoose');
const quizeSchema = require('./schema/quize');
const UserSchema = require('./schema/user');

const User = mongoose.model('User', UserSchema);
const Quize = mongoose.model('Quize', quizeSchema);

module.exports = { User, Quize };
