const supertest = require("supertest")
const app = require("../app")
const testSetup = require("./test-setup")
const server = app.listen(3000)
const request = supertest(server)
testSetup(server)

describe("go to main routes and have error? cause dont have error", () => {
    it("token is required to protected routes", async () => {
        const response = await request.get("/").set("Accept", "application/json")
        expect(response.body.status).toBe(404)
    })
})