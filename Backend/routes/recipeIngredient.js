const express = require('express');
const router = express.Router();
const RecipeIngredient = require('../models/recipe_ingredient');
const Ingredient = require('../models/ingredient');

// Route để lấy tất cả các nguyên liệu của một công thức nấu ăn theo ID
router.get('/:id/ingredients', async (req, res) => {
    console.log('Received request for ingredients');
    try {
        const recipeId = req.params.id;
        console.log(`Fetching ingredients for recipeId: ${recipeId}`);
        const ingredients = await RecipeIngredient.findAll({
            where: { recipeId },
            include: [
                {
                    model: Ingredient,
                    attributes: ['name', 'image'], // Các thuộc tính của Ingredient
                }
            ],
            attributes: ['amount', 'unit', 'original'], // Các thuộc tính của RecipeIngredient
        });
        if (ingredients.length > 0) {
            res.json(ingredients);
            console.log('Ingredients found');
        } else {
            res.status(404).json({ error: 'Ingredients not found' });
            console.log('Ingredients not found');
        }
    } catch (error) {
        // Ghi lỗi ra console để kiểm tra
        console.error(error);

        // Trả về thông báo lỗi cụ thể chỉ trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
            res.status(500).json({ error: error.message });
        } else {
            // Môi trường production sẽ chỉ trả thông báo lỗi chung chung
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

module.exports = router;