const router = require('express').Router()
const RegisterController = require('../controllers/RegisterController')
const UserController = require('../controllers/UserController')
const {
    authorization,
    authenticateUser,
} = require('../middlewares/Authentictae')

router.post('/register', RegisterController.createUser)
router.post('/login', RegisterController.loginUser)
router.get('/email-confirmation/:id_token', RegisterController.activateUser)

router.use(authorization)
router.use(authenticateUser)

router.post('/forget-password', UserController.forgetPassword)
router.post('/change-password', UserController.changePassword)
router.put('/update', UserController.updateDataUser)

module.exports = router
