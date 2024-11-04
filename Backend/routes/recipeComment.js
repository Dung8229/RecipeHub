const express = require('express');
const router = express.Router();
const RecipeComment = require('../models/recipe_comment');
const User = require('../models/user');

// Route để lấy tất cả các comment của một công thức nấu ăn theo ID
router.get('/recipes/:id/comments', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const comments = await RecipeComment.findAll({
            where: { recipeId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'], // Lấy thông tin user
                },
            ],
        });
        if (comments.length > 0) {
            res.json(comments);
        } else {
            res.status(404).json({ error: 'Comments not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

//Add route post to add a comment

module.exports = router;