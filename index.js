const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes/index')
const ErrorHandler = require('./middlewares/ErrorHandler')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', routes)
app.use(ErrorHandler)

app.listen(PORT, () => {
    console.log(`Run in port: ${PORT}`)
})
