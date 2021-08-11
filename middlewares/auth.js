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
            res.locals.user = user;
            return next()
        })
        .cath((e) => res.status(500).json({ code: 500, message: `${e.name} :: ${e.message}` }))
}

function userTokenVerify(req, res, next) {
    const { token } = req.body
    verifyToken(token).then(data => {
        if (data["userAgent"] !== req.get("User-Agent")) {
            throw new Error("invalid Toke")
        } else { return User.findOne({ email: data.email, token }) }
    }).then(user => { if (!user) { throw new Error("don't find user") } else { res.locals.user = user; return next() } }).catch(e => res.status(500).json({ code: 500, message: `${e.name} :: ${e.message}` }))
}

module.exports = { generateAccessToken, userTokenVerify, decodeToken, updateUserToken }