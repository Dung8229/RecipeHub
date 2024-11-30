// Component chính của web
const config = require('./utils/config');
const express = require('express');
require('express-async-error');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/users');
const competitionsRouter = require('./controllers/competitions');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const sequelize = require('./db');

const recipeIngredientsRouter = require('./routes/recipeIngredient');
const recipeInstructionsRouter = require('./routes/recipeInstructions');
const recipeComment = require('./routes/recipeComment');
const recipeRouter = require('./routes/recipe');
const favouritesRouter = require('./routes/favourite');
const recipeRatings = require('./routes/recipeRating');

const userProfile = require('./routes/userProfile');
const myRecipes = require('./routes/myRecipes');
// Kết nối DB
sequelize.authenticate()
  .then(() => logger.info('Kết nối db thành công!'))
  .catch((err) => logger.error('Lỗi kết nối db:', err));

// Middleware
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/competitions', competitionsRouter);

//app.use('/api/users', userProfile); // /api/users/:id
app.use('/api/users', myRecipes); // /api/users/:id/recipes
app.use('/api/users', favouritesRouter); // /api/favourites

app.use('/api/recipes', recipeIngredientsRouter); // /api/recipes/:id/ingredients
app.use('/api/recipes', recipeInstructionsRouter); // /api/recipes/:id/instructions
app.use('/api/recipes', recipeComment); // /api/recipes/:id/comments
app.use('/api/recipes', recipeRouter); // /api/recipes
app.use('/api/recipes', recipeRatings); // /api/recipeRatings

// Middleware xử lý lỗi
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
