// Component chính của web
const config = require('./utils/config')
const express = require('express')
require('express-async-error')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const sequelize = require('./db')

sequelize.authenticate() // Kiểm tra kết nối
  .then(() => {
    logger.info('Kết nối db thành công!')
  })

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app