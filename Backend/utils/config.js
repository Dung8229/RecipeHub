// Để hằng số ở đây và trong file .env
require('dotenv').config()

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const PORT = process.env.PORT

module.exports = {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  PORT
}