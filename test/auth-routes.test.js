const server = require("../app")
const chai = require("chai")
const { nanoid } = require("nanoid")
const { expect } = require("chai")
chaiHTTP = require("chai-http")

server.listen(3000, () => console.log("server listen"))

chai.should()
chai.use(chaiHTTP)

const email = `${nanoid(5)}@gmail.com`
const password = nanoid(8)

describe("Prime route test", () => {
    describe("prime route base", () => {
        it("token in prime routes is required", (done) => {
            chai.request(server)
                .post("/")
                .accept("application/json")
                .end((err, res) => {
                    res.should.have.status("403")
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("please check token/ Token is required")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(res.status)
                    done()
                })
        })
        it("token in prime routes will be valid generated by app", (done) => {
            chai.request(server)
                .post("/")
                .accept("application/json")
                .send({ token: nanoid(25) })
                .end((err, res) => {
                    res.should.have.status(403)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("JsonWebTokenError :: jwt malformed")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(res.status)
                    done()
                })
        })
    })
})

describe("Application auth system check", () => {
    describe("Signin with fake email, password", () => {
        it("email is required option?", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application/json")
                .send({})
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("username length will be more then 5 count or email length more then 8counts")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
        it("password is required", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application")
                .send({ email })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.message.should.be.equal("password length will be more then 6count")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
        it("with fake email && password dont have in response token", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("Error :: Don't find user")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
    })
    describe("Signup with invalid email&&password", () => {
        it("email is required option?", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application/json")
                .send({})
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("username length will be more then 5 count or email length more then 8counts")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
        it("password is required", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application")
                .send({ email })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.message.should.be.equal("password length will be more then 6count")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
        it("with invalid email && password dont have in response token", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application/json")
                .send({ email: nanoid(8), password: nanoid(6) })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("username length will be more then 5 count or email length more then 8counts")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
    })
    describe("signup with valid email && password and go to prime routes with saved token", () => {
        let signUpToken;
        let signInFirstToken;
        let signInSecondToken;
        it("sign up first", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("token")
                    res.body.token.should.to.have.lengthOf.above(20)
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(200)
                    signUpToken = res.body.token
                    done()
                })

        })
        it("sign up second", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.be.equal("Error :: try another email")
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })

        })
        it("sign in first", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("token")
                    res.body.token.should.to.have.lengthOf.above(20)
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(200)
                    signInFirstToken = res.body.token
                    done()
                })

        })
        it("sign in second", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("token")
                    res.body.token.should.to.have.lengthOf.above(20)
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(200)
                    signInSecondToken = res.body.token
                    done()
                })
        })
        it("signIn and SignUp tokens are not equal", (done) => {
            expect(signInFirstToken).is.not.equal(signUpToken)
            done()
        })
        it("signInFirst and signInSecond tokens are not equal", (done) => {
            expect(signInFirstToken).is.not.equal(signInSecondToken)
            done()
        })
        it("signInSecond and signUp tokens are not equal", (done) => {
            expect(signInSecondToken).is.not.equal(signUpToken)
            done()
        })
    })
    describe("to prime route with tokens with fake email and password, which has been register", () => {
        let signInToken;
        it("signup if doesnt exist", (done) => {
            chai.request(server)
                .post("/_api/user/signup")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.have.property("message")
                    res.body.message.should.to.have.lengthOf.above(5)
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(500)
                    done()
                })
        })
        it("signIn to app", (done) => {
            chai.request(server)
                .post("/_api/user/signin")
                .accept("application/json")
                .send({ email, password })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("token")
                    res.body.token.should.to.have.lengthOf.above(20)
                    res.body.should.have.property("status")
                    res.body.status.should.be.equal(200)
                    signInToken = res.body.token
                    done()
                })
        })
        it("to prime route with saved tokens and user email will be send to us", (done) => {
            chai.request(server)
                .post("/")
                .accept("application/json")
                .send({ token: signInToken })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property("user")
                    res.body.user.should.be.equal(email)
                    res.body.should.have.property("title")
                    res.body.title.should.be.equal("Express")
                    done()
                })

        })
    })
})

