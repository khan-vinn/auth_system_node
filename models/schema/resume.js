const mongoose = require("mongoose")

const ResumeSchema = mongoose.Schema({
    _creator: {
        type: mongoose.Types.ObjectId,
        required: true
    },
})

module.exports = ResumeSchema