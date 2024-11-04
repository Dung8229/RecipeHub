const express = require('express');
const router = express.Router();
const RecipeIngredient = require('../models/recipe_ingredient');
const Ingredient = require('../models/ingredient');

// Route để lấy tất cả các nguyên liệu của một công thức nấu ăn theo ID
router.get('/recipes/:id/ingredients', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const ingredients = await RecipeIngredient.findAll({
            where: { recipeId },
            include: [
                {
                    model: Ingredient,
                    attributes: ['name'],
                },
            ],
        });
        if (ingredients.length > 0) {
            res.json(ingredients);
        } else {
            res.status(404).json({ error: 'Ingredients not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;