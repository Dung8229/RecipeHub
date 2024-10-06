// api của user
const usersRouter = require('express').Router()
const sequelize = require('../db')
const logger = require('../utils/logger')
const User = require('../models/user')

// usersRouter.get('/', async (request, response) => {
//   const users = await User.findAll() // Lấy tất cả người dùng

//   response.json(users)
// })

module.exports = usersRouter