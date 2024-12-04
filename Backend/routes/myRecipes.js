const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const RecipeIngredient = require('../models/recipe_ingredient');
const RecipeTag = require('../models/recipe_tag')
//const middleware = require('../utils/middleware'); // Import middleware

// Route để lấy tất cả các công thức của một người dùng
router.get('/:userId/recipes', async (req, res) => {
    try {
        const userId = req.params.userId;
        const recipes = await Recipe.findAll({
            where: { userId },
            attributes: ['id', 'title', 'image', 'imageType', 'readyInMinutes', 'servings'],
        });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

// Route to delete a user's recipe
router.delete('/:userId/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findOne({ where: { id } });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        let recipeId = id;
        let recipe_id = id;

        // Delete related records in the recipe_ingredient table
        await RecipeIngredient.destroy({ where: { recipeId } });
        await RecipeTag.destroy({ where: { recipe_id } });

        // Delete the recipe
        await recipe.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

module.exports = router;