const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const { Op } = require('sequelize');
const RecipeAverageRating = require('../models/recipe_averagerating');

// Route to get latest 5 recipes
router.get('/latest', async (req, res) => {
    try {
        const latestRecipes = await Recipe.findAll({
            attributes: ['id', 'title', 'image'],
            order: [['created_at', 'DESC']],
            limit: 5,
        });
        res.json(latestRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

// Route to get top 5 trending recipes (highest views)
router.get('/trending', async (req, res) => {
    try {
        const trendingRecipes = await Recipe.findAll({
            attributes: ['id', 'title', 'image'],
            order: [['views', 'DESC']],
            limit: 5,
            include: [
                { model: RecipeAverageRating, attributes: ['averageUserRating', 'totalUserRatings'] }
            ]
        });
        res.json(trendingRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});



// Route to get popular recipes(Not available at this version)
router.get('/popular', async (req, res) => {
    try {
        const popularRecipes = await Recipe.findAll({
            order: [['likes', 'DESC']],
            limit: 10,
            include: [
                { model: RecipeAverageRating, attributes: ['averageUserRating', 'totalUserRatings'] }
            ]
        });

        res.json(popularRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});



router.get('/forInformationPage/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Tăng lượt xem
        const [recipe] = await Promise.all([
            Recipe.findByPk(recipeId, {
                attributes: ['id', 'userId', 'title', 'image', 'imageType', 'summary', 'readyInMinutes', 'servings', 'views'],
            }),
            Recipe.increment('views', { where: { id: recipeId } }),
        ]);

        // Kiểm tra nếu không tìm thấy công thức
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Trả về dữ liệu công thức
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Route để thêm mới một công thức

module.exports = router;