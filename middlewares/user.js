function UserParamsValidate(req, res, next) {
    const { username, password, email } = req.body

    if ((username && typeof (username) === "string" && username.length > 5)
        || (email && typeof (email) === "string" && email.length > 8)) {
        if (password && typeof (password) === "string" && password.length > 6) {
            return next()
        } else {
            res.status(500).json({ status: 500, "message": "password length will be more then 6count" })
        }
    } else {
        res.status(500).json({ status: 500, "message": "username length will be more then 5 count or email length more then 8counts" })
    }
}

function userTokenValidate(req, res, next) {
    const { token } = req.body
    if (token && typeof (token) === "string" && token.length > 20) {
        return next()
    } else {
        return res.status(403).json({ "please check token/ Token is required"})
    }
}

module.exports = { UserParamsValidate, userTokenValidate }