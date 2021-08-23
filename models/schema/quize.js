const { nanoid } = require("nanoid")
const mongoose = require("mongoose")

const querySchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    invalidAnswers: {
        type: [String],
        required: true,
        minLength: 2
    }
})

const quizeSchema = mongoose.Schema({
    answers: {
        type: [querySchema],
        required: true,
        minLength: 1,
        maxLength: 25
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })

module.exports = quizeSchema
