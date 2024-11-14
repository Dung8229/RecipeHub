const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
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

module.exports = router;