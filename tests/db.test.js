const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const ResumeSchema = require("../models/schema/resume");
const UserSchema = require("../models/schema/user");
const testSetUp = require("./testSetUp");
const User = mongoose.model("TestUser", UserSchema)
const Resume = mongoose.model("TestResume", ResumeSchema)
testSetUp()

describe("DB test setup", () => {
    const email = `${nanoid(5)}@gmail.com`
    it("create user with email without password", async () => {
        try {
            await User.create({ email })
        } catch (error) {
            expect(error.toString()).toMatch(/password/)
        }
    })
    afterEach(async () => {
        await User.deleteMany({ email })
    })
})