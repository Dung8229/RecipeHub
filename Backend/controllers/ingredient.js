const ingredientRouter = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
const ShoppinglistRecipe = require('../models/shoppinglist_recipe')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const Ingredient = require('../models/ingredient')
const Sequelize = require('sequelize')
const RecipeIngredient = require('../models/recipe_ingredient')

// Tìm kiếm nguyên liệu theo từ khóa
ingredientRouter.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Query cannot be empty.' });
  }

  try {
    const ingredients = await Ingredient.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('name')),
        'LIKE',
        `%${query.toLowerCase()}%`
      ), // Tìm kiếm không phân biệt hoa thường
      attributes: ['id', 'name', 'image'], // Chỉ trả về các thông tin cần thiết
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = ingredientRouter