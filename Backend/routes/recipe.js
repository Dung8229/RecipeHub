const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// Route để lấy thông tin công thức nấu ăn theo id
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId, {
            attributes: ['id', 'userId', 'title', 'image', 'imageType', 'summary', 'readyInMinutes', 'servings'],
        });
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ error: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Route để thêm mới một công thức
router.post('/', async (req, res) => {
    try {
        const { userId, title, image, imageType, summary, readyInMinutes, servings } = req.body;
        const newRecipe = await Recipe.create({
            userId,
            title,
            image,
            imageType,
            summary,
            readyInMinutes,
            servings,
        });
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



module.exports = router;