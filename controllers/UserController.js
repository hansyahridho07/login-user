const { user } = require('../models/index')
// const { Op } = require("sequelize")
// const { v4: uuidv4 } = require('uuid');
const ResponseFactory = require('../helpers/ResponseFactory')
const Utill = require('../helpers/Utility')

module.exports = class UserController {
    static async forgetPassword(req, res, next) {
        const { password1, password2 } = req.body
        const user_id = req.user.id
        try {
            if (password1 !== password2) {
                return res
                    .status(400)
                    .json(ResponseFactory.GeneralError('Password tidak cocok'))
            }

            const check = await user.findByPk(user_id, {
                attributes: ['id', 'password'],
            })

            if (!check) {
                return res
                    .status(404)
                    .json(ResponseFactory.GeneralError('User tidak ditemukan'))
            }

            if (Utill.compareBcrypt(password1, check.password)) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Tidak bisa mengganti dengan password yang sekarang'
                        )
                    )
            }

            await user.update(
                { password: Utill.hashingBcrypt(password1) },
                { where: { id: user_id } }
            )

            return res
                .status(200)
                .json(
                    ResponseFactory.GeneralSuccess(
                        'Password berhasil di ganti',
                        null
                    )
                )
        } catch (error) {
            next(error)
        }
    }

    static async changePassword(req, res, next) {
        const { oldpassword, newpassword1, newpassword2 } = req.body
        const user_id = req.user.id
        try {
            if (newpassword1 !== newpassword2) {
                return res
                    .status(400)
                    .json(ResponseFactory.GeneralError('Password tidak cocok'))
            }

            const check = await user.findByPk(user_id, {
                attributes: ['password'],
            })

            if (!check) {
                return res
                    .status(404)
                    .json(ResponseFactory.GeneralError('User tidak ditemukan'))
            }

            if (!Utill.compareBcrypt(oldpassword, check.password)) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Password sebelumnya salah'
                        )
                    )
            }

            if (Utill.compareBcrypt(newpassword1, check.password)) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Tidak bisa mengganti dengan password yang sama sebelumnya'
                        )
                    )
            }

            await user.update(
                { password: Utill.hashingBcrypt(newpassword1) },
                { where: { id: user_id } }
            )

            res.status(200).json(
                ResponseFactory.GeneralSuccess('Berhasil ganti password', null)
            )
        } catch (error) {
            next(error)
        }
    }

    static async updateDataUser(req, res, next) {
        const { name, image, phone_number } = req.body
        const user_id = req.user.id
        try {
            const updateDataUser = {}
            if (name) updateDataUser.name = name
            if (image) {
                try {
                    const fccUrl = new URL(image)
                    updateDataUser.image = fccUrl
                } catch (error) {
                    console.error('invalid url image')
                }
            }
            if (phone_number) updateDataUser.phone_number = phone_number

            await user.update(updateDataUser, { where: { id: user_id } })

            res.status(200).json(
                ResponseFactory.GeneralSuccess(
                    'Berhasil update data user',
                    null
                )
            )
        } catch (error) {
            next(error)
        }
    }
}
