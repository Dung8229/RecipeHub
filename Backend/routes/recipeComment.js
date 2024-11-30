const express = require('express');
const router = express.Router();
const RecipeComment = require('../models/recipe_comment');
const User = require('../models/user');
const Recipe = require('../models/recipe');
// Route để lấy tất cả các comment của một công thức nấu ăn theo ID
router.get('/:id/comments', async (req, res) => {
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
            attributes: ['userId', 'commentText'], // Lấy thông tin comment
        });
        if (comments.length > 0) {
            res.json(comments);
        } else {
            res.status(404).json({ error: 'Comments not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
        console.log(error)
    }
});

//Add route post to add a comment
// Route để thêm comment vào một công thức nấu ăn
router.post('/:id/comments', async (req, res) => {
    console.log(req.body);
    try {
        const recipeId = req.params.id;
        const { userId, commentText } = req.body;
        if (!userId || !commentText) {
            return res.status(400).json({ error: 'userId and commentText are required' });
        }
        const comment = await RecipeComment.create({ recipeId, userId, commentText });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
        console.log(error);
    }
});

module.exports = router;