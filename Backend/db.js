// Kết nối database
const { Sequelize } = require('sequelize')
const config = require('./utils/config')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;