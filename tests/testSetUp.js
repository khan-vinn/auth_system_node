require("dotenv").config()
const mongoose = require("mongoose")

function testSetUp(server) {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    })

    afterAll(async () => {
        if (server) await server.close()
        // await mongoose.connection.dropDatabase("resume_app_test") //admin prevelegious for drop db
        await mongoose.disconnect();
    })
}

module.exports = testSetUp