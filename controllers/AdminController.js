const { user } = require('../models/index')
const ResponseFactory = require('../helpers/ResponseFactory')

module.exports = class AdminController {
    static async updateStatusAccount(req, res, next) {
        const { status } = req.body
        const id = req.params.id

        try {
            if (!id || !status) {
                return res
                    .status(404)
                    .json(
                        ResponseFactory.GeneralError(
                            'ID dan status tidak boleh kosong!'
                        )
                    )
            }

            const check = await user.findByPk(id)

            if (!check) {
                return res
                    .status(404)
                    .json(ResponseFactory.GeneralError('User tidak ditemukan!'))
            }

            const arrayStatus = [0, 1]
            if (!arrayStatus.includes(status)) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError('Status tidak terdaftar!')
                    )
            }
            await user.update({ status: status }, { where: { id: id } })

            const message =
                status === 1
                    ? 'Status user sudah aktif'
                    : 'Status user sudah non aktif'

            return res
                .status(200)
                .json(ResponseFactory.GeneralSuccess(message, null))
        } catch (error) {
            next(error)
        }
    }
}
