const mongoose = require("mongoose");
const quizeSchema = require("./schema/quize");
const UserSchema = require("./schema/user");

const User = mongoose.model("Users", UserSchema)
const Quize = mongoose.model("Quize", quizeSchema)

module.exports = { User, Quize }
