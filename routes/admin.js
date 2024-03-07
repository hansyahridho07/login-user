const router = require('express').Router()
const AdminController = require('../controllers/AdminController')
const {
    authorization,
    authenticateAdmin,
} = require('../middlewares/Authentictae')

router.patch(
    '/status',
    authorization,
    authenticateAdmin,
    AdminController.updateStatusAccount
)
module.exports = router
