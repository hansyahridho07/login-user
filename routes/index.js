const routes = require('express').Router()
const userRoute = require('./user')
const adminRoute = require('./admin')

routes.use('/user', userRoute)
routes.use('/admin', adminRoute)

module.exports = routes
