require("dotenv").config()
const jwt = require("jsonwebtoken")

async function generateAccessToken(data) {
    const res = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "21d" })
    return res
}

async function authenticateToken(req, res, next) {
    try {
        const token = req.body.token
            || req.query.token
            || req.headers["x-access-token"]
            || req.headers['authorization']?.split(' ')[1]
        req.user = await jwt.verify(token, process.env.JWT_SECRET)
        return next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "error" })
    }
}

module.exports = { generateAccessToken, authenticateToken }