const { nanoid } = require("nanoid")
const app = require("../app")
const testSetUp = require("./testSetUp")

const server = app.listen(3000)
const request = require("supertest")(server)
testSetUp(server)

describe("Auth routes test setup", () => {
    describe("Go to main routes and have error? cause dont have error", () => {
        it("Token is required to protected routes", async () => {
            const response = await request.get("/").set("Accept", "application/json")
            expect(response.body.message && response.body.status).toBeTruthy()
            expect(response.body.status).toBe(403)
            expect(response.body.message).toMatch(/required/)
        })

        it("Token length will be more then 20", async () => {
            const response = await request.post("/")
                .set("Accept", "application/json")
                .send({ token: nanoid(17) })
            expect(response.body).toBeTruthy()
            expect(response.body.status).toBe(403)
            expect(response.body.message).toBeTruthy()
            expect(response.body.message).toMatch(/20/)
            expect(response.body.message.length).toBeGreaterThan(10)
            expect(response.body.message.length).toBeLessThan(80)
        })
    })
})