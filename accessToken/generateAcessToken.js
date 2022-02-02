const jwt = require('jsonwebtoken')

module.exports = function generateAcessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}