// Component chính của web
const config = require('./utils/config')
const express = require('express')
require('express-async-error')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const competitionsRouter = require('./controllers/competitions')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const sequelize = require('./db')

const recipeInstructionsRouter = require('./routes/recipeInstructions');
const recipeIngredientsRouter = require('./routes/recipesIngredients');
const recipeComment = require('./routes/recipe_comment');
const recipeRouter = require('./routes/recipe')
const favouritesRouter = require('./routes/favourites');
const recipeRatings = require('./routes/recipeRatings');
sequelize.authenticate() // Kiểm tra kết nối
  .then(() => {
    logger.info('Kết nối db thành công!')
  })

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/competitions', competitionsRouter)

app.use('/api/recipeInstructions', recipeInstructionsRouter);
app.use('/api/recipeIngredients', recipeIngredientsRouter);
app.use('/api/recipeComment', recipeComment);
app.use('/api/recipes', recipeRouter);
app.use('/api/favourites', favouritesRouter);
app.use('/api/recipeRatings', recipeRatings);
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app