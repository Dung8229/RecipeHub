const express = require('express');
const router = express.Router();
const RecipeRating = require('../models/recipe_rating');
const User = require('../models/user');

// Route để lấy tất cả các đánh giá của một công thức nấu ăn và tính toán đánh giá trung bình
router.get('/:id/ratings', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const ratings = await RecipeRating.findAll({
            where: { recipeId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'], // Lấy thông tin user
                },
            ],
        });

        if (ratings.length > 0) {
            const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
            res.json({ ratings, averageRating });
        } else {
            res.status(404).json({ error: 'Ratings not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
// Route to add or update a user rating for a recipe
router.post('/:id/ratings', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { userId, rating } = req.body;

        if (!userId || !rating) {
            return res.status(400).json({ error: 'userId and rating are required' });
        }

        const existingRating = await RecipeRating.findOne({ where: { userId, recipeId } });
        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
            res.status(200).json(existingRating);
        } else {
            const newRating = await RecipeRating.create({ userId, recipeId, rating });
            res.status(201).json(newRating);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

router.get('/:id/ratings/:userId', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.params.userId;
        const rating = await RecipeRating.findOne({ where: { userId, recipeId } });
        if (rating) {
            res.json(rating);
        } else {
            res.status(404).json({ error: 'Rating not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
        console.log(error);
    }
});

module.exports = router;