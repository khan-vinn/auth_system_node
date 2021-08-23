const mongoose = require("mongoose")

const ResumeSchema = mongoose.Schema({
    belengs_to: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })

module.exports = ResumeSchema
