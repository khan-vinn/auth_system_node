const mongoose = require("mongoose")

const ResumeSchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: () => mongoose.Types.ObjectId(),
        unique: true
    },
    _creator: {
        type: mongoose.Types.ObjectId,
        required: true
    },
})

module.exports = ResumeSchema