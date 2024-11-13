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


router.get('/:id/ingredients', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const ingredients = await RecipeIngredient.findAll({
      where: { recipeId }
    });
    if (ingredients.length > 0) {
      console.log('Instructions found');
      res.json(ingredients);
    } else {
      console.log('Ingredients not found');
      res.status(404).json({ error: 'Ingredients not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/:id/instructions', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const instructions = await RecipeInstruction.findAll({
      where: { recipeId }
    });
    if (instructions.length > 0) {
      res.json(instructions);
    } else {
      res.status(404).json({ error: 'Instructions not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = recipesRouter
