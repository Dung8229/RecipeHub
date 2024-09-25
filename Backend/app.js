// Component chính của web
const config = require('./utils/config')
const express = require('express')
require('express-async-error')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const sequelize = require('./db')

sequelize.authenticate() // Kiểm tra kết nối
logger.info('Kết nối db thành công!')

app.use(cors())

app.use('/api/users', usersRouter)


module.exports = app