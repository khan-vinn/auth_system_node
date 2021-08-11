require("dotenv").config()
const jwt = require("jsonwebtoken")
const { User } = require("../models")

async function generateAccessToken(data) {
    const res = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "21d" })
    return res
}

async function decodeToken(token) {
    const res = await jwt.decode(token)
    return res
}
async function verifyToken(data) {
    const res = await jwt.verify(data, process.env.JWT_SECRET)
    return res
}

function updateUserToken(req, res, next) {
    const { token } = req.body
    User.findOne({ token })
        .then((user) => {
            if (!user) {
                throw new Error("dont find user")
            } else {
                return generateAccessToken({ email: user.email, userAgent: req.get('User-Agent') })
            }
        })
        .then((newToken) => User.findOneAndUpdate({ token }, { token: newToken }))
        .then((user) => {
            req.user = user;
            return next()
        })
        .cath((e) => res.code(500).json({ code: 500, message: `${e.name}::${e.message}` }))
}

function userTokenVerify(req, res, next) {
    const { token } = req.body
    verifyToken(token)
        .then(props => {
            if (props["User-Agent"] === req.get("User-Agent")) {
                return User.findOne({ email: props.email, token })
            } else {
                throw new Error("Token validate error")
            }
        })
        .then((user) => {
            if (!user) {
                throw new Error("Dont find user")
            } else {
                req.user = user
                return next()
            }
        })
        .cath((e) => res.code(500).json({ code: 500, message: `${e.name}::${e.message}` }))
}

module.exports = { generateAccessToken, userTokenVerify, decodeToken, updateUserToken }