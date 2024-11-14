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

module.exports = router;