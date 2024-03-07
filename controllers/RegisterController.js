const { user } = require('../models/index')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const ResponseFactory = require('../helpers/ResponseFactory')
const Utill = require('../helpers/Utility')
const sendEmail = require('../helpers/email_confirmation')

module.exports = class RegisterController {
    static async createUser(req, res, next) {
        const {
            username,
            name,
            email,
            password,
            role = 'USER',
            type = 'MANUAL',
            phone_number,
        } = req.body

        try {
            const id = uuidv4()
            const token_confirmation = uuidv4()
            const createUser = {
                id: id,
                username: username,
                name: name,
                email: email,
                password: password,
                phone_number: phone_number,
                token_confirmation: token_confirmation,
                role: role.toUpperCase(),
                type: type,
            }

            const result = await user.create(createUser)
            const payloadEmailConfirmation = {
                name: name,
                email: email,
                token_confirmation: token_confirmation,
            }

            await sendEmail.send(payloadEmailConfirmation)

            delete result.dataValues.id
            delete result.dataValues.password
            delete result.dataValues.token_confirmation
            delete result.dataValues.token_confirmation
            delete result.dataValues.type
            delete result.dataValues.updated_at
            res.status(201).json({
                success: true,
                message: 'Berhasil',
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    static async activateUser(req, res, next) {
        try {
            const token_confirmation = req.params.id_token

            if (!token_confirmation) {
                return res
                    .status(404)
                    .json(ResponseFactory.GeneralError('Token tidak ditemukan'))
            }

            const check = await user.findOne({
                where: { token_confirmation: token_confirmation },
            })

            if (!check) {
                return res
                    .status(404)
                    .json(ResponseFactory.GeneralError('Akun tidak ditemukan'))
            }
            if (check.email_confirmation === 1) {
                return res
                    .status(202)
                    .json(
                        ResponseFactory.GeneralSuccess('Akun sudah aktif', null)
                    )
            }

            await user.update(
                { status: 1, email_confirmation: 1 },
                { where: { id: check.id } }
            )

            res.status(200).json(
                ResponseFactory.GeneralSuccess(
                    'Akun berhasil di aktifkan',
                    null
                )
            )
        } catch (error) {
            next(error)
        }
    }

    static async loginUser(req, res, next) {
        const { email, password } = req.body

        try {
            if (!email || !password) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Email atau password tidak boleh kosong'
                        )
                    )
            }

            const check = await user.findOne({
                where: {
                    [Op.or]: [{ username: email }, { email: email }],
                },
                attributes: [
                    'id',
                    'password',
                    'status',
                    'name',
                    'email',
                    'username',
                    'role',
                ],
            })

            if (!check) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Email atau password salah!'
                        )
                    )
            }
            if (check.status === 0 && check.email_confirmation === 1) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Akun Anda di nonaktifkan, silahkan menghubungi admin'
                        )
                    )
            }
            if (check.status === 0) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Akun belum aktif, silahkan check email untuk aktifasi'
                        )
                    )
            }

            const comparePassword = Utill.compareBcrypt(
                password,
                check.password
            )

            if (!comparePassword) {
                return res
                    .status(400)
                    .json(
                        ResponseFactory.GeneralError(
                            'Email atau password salah!'
                        )
                    )
            }

            const payloadJWT = {
                id: check.id,
                name: check.name,
                email: check.email,
                username: check.username,
                role: check.role,
            }

            const access_token = Utill.generateAccessToken(payloadJWT)

            const data = {
                type: 'Bearer',
                accessToken: access_token,
                expiredIn: 1000 * 60 * 60 - 1,
            }

            res.status(200).json(
                ResponseFactory.GeneralSuccess('Berhasil', data)
            )
        } catch (error) {
            next(error)
        }
    }
}
