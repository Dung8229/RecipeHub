// api liên quan công thức
const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')
const middleware = require('../utils/middleware')

// Lấy các công thức dinner
const getDinnerRecipes = async (req, res) => {
    try {
      const dinnerRecipes = await Recipe.findAll({
        where: { category: 'dinner' }
      });
      res.json(dinnerRecipes);
    } catch (error) {
      console.error('Error fetching dinner recipes:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

recipesRouter.get('/dinner', getDinnerRecipes);

module.exports = recipesRouter