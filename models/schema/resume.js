const mongoose = require("mongoose")

const ResumeSchema = mongoose.Schema({
    belengs_to: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

module.exports = ResumeSchema
