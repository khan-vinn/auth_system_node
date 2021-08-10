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
        const res = await jwt.verify(token, process.env.JWT_SECRET)
        if (!res) {
            return res.json({ "code": 403, "message": "token check error" })
        }
        req.user = res
        return next()
    } catch (error) {
        console.log(error)
        return res.json({ "status": 403, "message": "token check error" })
    }
}

module.exports = { generateAccessToken, authenticateToken }