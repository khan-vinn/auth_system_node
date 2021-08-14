const { nanoid } = require("nanoid")
const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        minLength: 8,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    username: {
        type: String,
        minLength: 5,
        required: true,
        default: () => nanoid(8)
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
})

module.exports = UserSchema