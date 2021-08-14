const mongoose = require("mongoose")

function testSetup(server) {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    })
    afterAll(async () => {
        await server.close()
        await mongoose.disconnect();
    })
}

module.exports = testSetup