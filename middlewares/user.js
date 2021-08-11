function UserParamsValidate(req, res, next) {
    const { username, password, email } = req.body

    if ((username && typeof (username) === "string" && username.length > 5)
        || (email && typeof (email) === "string" && email.length > 8)) {
        if (password && typeof (password) === "string" && password.length > 6) {
            next()
        } else {
            return res.status(500).json({ status: 500, "message": "password length will be more then 6count" })
        }
    } else {
        return res.status(500).json({ status: 500, "message": "username length will be more then 5 count or email length more then 8counts" })
    }
}

function userParamsTokenValidate(req, res, next) {
    const { token } = req.body
    if (token && typeof (token) === "string" && token.length > 20) {
        return next()
    } else {
        return res.status(403).json({ code: 403, message: "please check token/ Token is required" })
    }
}

module.exports = { UserParamsValidate, userParamsTokenValidate }