const { nanoid } = require("nanoid")
const app = require("../app")
const { decodeToken } = require("../middlewares/auth")
const { User } = require("../models")
const testSetUp = require("./testSetUp")

const server = app.listen(3000)
const request = require("supertest")(server)
testSetUp(server)

const signRoute = "/_api/user/"

describe("Auth routes test setup", () => {
    afterAll(async () => {
        await User.findOneAndRemove({ email: emailToSignUp })
    })
    const emailToSignIn = `${nanoid(6)}@gmail.com`
    const emailToSignUp = `${nanoid(6)}@gmail.com`
    const passwortToSignIn = nanoid(8)
    const passwordToSignUp = nanoid(8)
    describe("passwords to signin and signup are not equal", () => {
        it("passwords are not eqaul", () => {
            expect(emailToSignIn).not.toBe(emailToSignUp)
        })
        it("emails not equal", () => {
            expect(passwordToSignUp).not.toBe(passwortToSignIn)
        })
    })
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
            const { status, message } = response.body
            expect(response.body).toBeTruthy()
            expect(status).toBe(403)
            expect(message).toBeTruthy()
            expect(message).toMatch(/20/)
            expect(message.length).toBeGreaterThan(10)
            expect(message.length).toBeLessThan(80)
        })
    })
    describe("SignIn route", () => {
        it("signin with not registred password and email", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email: emailToSignIn, password: passwortToSignIn })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(message && status).toBeTruthy()
            expect(message.length).toBeGreaterThan(1)
            expect(message.length).toBeLessThan(85)
            expect(message).toBe("Error :: Don't find user")
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThan(501)
        })
        it("signin with email and invalid password ", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email: emailToSignIn, password: nanoid(5) })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(message && status).toBeTruthy()
            expect(message.length).toBeGreaterThan(1)
            expect(message.length).toBeLessThan(85)
            expect(message).toBe("password length will be more then 6count")
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThan(501)
        })
        it("signin with  password and  invalid email", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email: nanoid(5), password: passwortToSignIn })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(message && status).toBeTruthy()
            expect(message.length).toBeGreaterThan(1)
            expect(message.length).toBeLessThan(85)
            expect(message).toBe("username length will be more then 5 count or email length more then 8counts")
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThan(501)
        })
    })
    describe("SignUp route", () => {
        it("signup with not registred password and email and got new token", async () => {
            const response = await request.post(signRoute + "signup")
                .set("Accept", "application/json")
                .send({ email: emailToSignUp, password: passwordToSignUp })
            const { status, token } = response.body
            expect(response.status).toBe(200)
            expect(token && status).toBeTruthy()
            expect(token.length).toBeGreaterThan(20)
            expect(token.length).toBeLessThan(200)
            expect(status).toBeGreaterThan(199)
            expect(status).toBeLessThan(210)
            const decodedToken = await decodeToken(token)
            expect(decodedToken.email).toBe(emailToSignUp)
        })
        it("signUp with email and invalid password ", async () => {
            const response = await request.post(signRoute + "signup")
                .set("Accept", "application/json")
                .send({ email: emailToSignIn, password: nanoid(5) })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(message && status).toBeTruthy()
            expect(message.length).toBeGreaterThan(1)
            expect(message.length).toBeLessThan(85)
            expect(message).toBe("password length will be more then 6count")
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThan(501)
        })
        it("signUp with  password and  invalid email", async () => {
            const response = await request.post(signRoute + "signup")
                .set("Accept", "application/json")
                .send({ email: nanoid(5), password: passwordToSignUp })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(message && status).toBeTruthy()
            expect(message.length).toBeGreaterThan(1)
            expect(message.length).toBeLessThan(85)
            expect(message).toBe("username length will be more then 5 count or email length more then 8counts")
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThan(501)
        })
    })
    describe("signIn after signUp with incorrected datas", () => {
        const email = `${nanoid(9)}@mail.com`
        const password = nanoid(9)
        beforeAll(async () => {
            await request.post(signRoute + "signUp")
                .set("Accept", "application/json")
                .send({ email, password })
        })
        afterAll(async () => {
            await User.findOneAndDelete({ email })
        })
        it("SignIn with invalid on length password(less)", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email, password: nanoid(5) })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThanOrEqual(500)
            expect(message.length).toBeGreaterThan(2)
            expect(message).toBe("password length will be more then 6count")
        })
        it("SignIn with invalid on length password(greater)", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email, password: nanoid(10) })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThanOrEqual(500)
            expect(message.length).toBeGreaterThan(2)
            expect(message).toBe("Error :: Password is incorrected")
        })
        it("SignIn with invalid email", async () => {
            const response = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email: nanoid(12), password: nanoid(10) })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThanOrEqual(500)
            expect(message.length).toBeGreaterThan(2)
            expect(message).toBe("Error :: Don't find user")
        })
        it("signUp with exist email", async () => {
            const response = await request.post(signRoute + "signUp")
                .set("Accept", "application/json")
                .send({ email, password })
            const { status, message } = response.body
            expect(response.status).toBe(500)
            expect(status).toBeGreaterThan(400)
            expect(status).toBeLessThanOrEqual(500)
            expect(message.length).toBeGreaterThan(2)
            expect(message).toBe("Error :: try another email")
        })
    })
    describe("token not equal from signIn and signUp", () => {
        it("compare two tokens", async () => {
            const responseFromSignUp = await request.post(signRoute + "signup")
                .set("Accept", "application/json")
                .send({ email: emailToSignUp, password: passwordToSignUp })
            const responseFromSignIn = await request.post(signRoute + "signin")
                .set("Accept", "application/json")
                .send({ email: emailToSignUp, password: passwordToSignUp })
            expect(responseFromSignIn.body.token).not.toBe(responseFromSignUp.body.token)
        })
    })
})