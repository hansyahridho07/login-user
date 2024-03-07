const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const controller = {}
const secret = process.env.SECRET_JWT

// encrypt password to database
controller.hashingBcrypt = (plaintext) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(plaintext, salt)
    return hash
}

// check password in database
controller.compareBcrypt = (plainPassword, encryptPassword) => {
    return bcrypt.compareSync(plainPassword, encryptPassword)
}

// generate jsonwebtoken
controller.generateAccessToken = (payload) => {
    const access_token = jwt.sign(payload, secret, { expiresIn: '1h' })
    return access_token
}

// check really token or not
controller.verifyAccessToken = (access_token) => {
    try {
        const decoded = jwt.verify(access_token, secret)
        return decoded
    } catch (error) {
        return false
    }
}

module.exports = controller
