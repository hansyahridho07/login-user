const ResponseFactory = require('../helpers/ResponseFactory')

module.exports = (err, req, res, _) => {
    console.log(err)

    const arrErrorSequelize = [
        'SequelizeUniqueConstraintError',
        'SequelizeValidationError',
    ]
    if (arrErrorSequelize.includes(err.name)) {
        const arrayError = [...err.errors]
        let msg
        arrayError.forEach((el, idx) => {
            if (idx === 0) {
                msg = el.message + ','
            } else {
                msg += ' ' + el.message + ','
            }
        })
        msg = msg.slice(0, msg.length - 1)
        console.error('Validasi error: ' + msg)
        return res.status(400).json(ResponseFactory.GeneralError(msg))
    }
    console.log(err.name)

    res.status(500).json(ResponseFactory.GeneralError('Internal server error'))
}
