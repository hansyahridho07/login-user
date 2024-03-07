const ResponseFactory = require('../helpers/ResponseFactory')
const Utill = require('../helpers/Utility')

module.exports = {
    authorization: (req, res, next) => {
        if (!req.headers.authorization) {
            return res
                .status(400)
                .json(ResponseFactory.GeneralError('Authorization is required'))
        }
        const accessToken = req.headers.authorization.split(' ')
        if (accessToken.length !== 2) {
            return res
                .status(400)
                .json(
                    ResponseFactory.GeneralError('Invalid header Authorization')
                )
        }
        if (accessToken[0] !== 'Bearer') {
            return res
                .status(400)
                .json(ResponseFactory.GeneralError('Invalid access token'))
        }

        const token = accessToken[1]
        const payload = Utill.verifyAccessToken(token)

        if (!payload) {
            return res
                .status(401)
                .json(ResponseFactory.GeneralError('Unauthorized'))
        } else {
            req.user = { ...payload }
            next()
        }
    },

    authenticateAdmin: (req, res, next) => {
        /**
     * payload:
      {
        id: string,
        name: string,
        email: string,
        username: string,
        role: string
      }
     */

        if (req.user.role === 'ADMIN') {
            next()
        } else {
            return res
                .status(403)
                .json(ResponseFactory.GeneralError("You don't have access"))
        }
    },

    authenticateUser: (req, res, next) => {
        /**
     * payload:
      {
        id: string,
        name: string,
        email: string,
        username: string,
        role: string
      }
     */

        if (req.user.role === 'USER') {
            next()
        } else {
            return res
                .status(403)
                .json(ResponseFactory.GeneralError("You don't have access"))
        }
    },
}
