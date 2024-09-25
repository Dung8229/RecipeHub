const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.get('/', (request, response) => {
  response.send('<h1>Mọi công thức mà bạn tìm</h1> Đi tới http://localhost:3001/api/users để xem users',)
})

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})