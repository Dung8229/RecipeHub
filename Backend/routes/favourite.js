const express = require('express');
const router = express.Router();
const Favourites = require('../models/favourites');
const Recipe = require('../models/recipe');
const User = require('../models/user');
// const authenticate = require('../middleware/authenticate'); // Import middleware

// Route để lấy danh sách công thức yêu thích của người dùng
router.get('/:userId/favourites', async (req, res) => {
    try {
        const userId = req.params.userId;
        const favourites = await Favourites.findAll({
            where: { userId },
            include: [
                {
                    model: Recipe,
                    attributes: ['id', 'title', 'image', 'imageType', 'readyInMinutes', 'servings'],
                    include: [{
                        model: User, attributes: ['username']
                    }],
                },
            ],
        });
        if (favourites.length > 0) {
            res.json(favourites);
        } else {
            res.status(404).json({ error: 'No favourites found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});



// Route để thêm công thức vào danh sách yêu thích

router.post('/:userId/fav', async (req, res) => {
    console.log(req.body);
    try {
        const { userId, recipeId } = req.body;
        if (!userId || !recipeId) {
            return res.status(400).json({ error: 'userId and recipeId are required' });
        }
        const favourite = await Favourites.create({ userId, recipeId });
        res.status(201).json(favourite);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
        console.log(error);
    }
});

// Route để xóa công thức khỏi danh sách yêu thích
router.delete('/:userId/del', async (req, res) => {
    try {
        const { userId } = req.params;
        const { recipeId } = req.body;
        if (!userId || !recipeId) {
            return res.status(400).json({ error: 'userId and recipeId are required' });
        }
        const favourite = await Favourites.findOne({ where: { userId, recipeId } });
        if (favourite) {
            await favourite.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Favourite not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Cannot delete recipe' });
        console.log(error);
    }
});

router.get('/:userId/check', async (req, res) => {
    try {
        const { userId } = req.params; // Corrected destructuring
        const { recipeId } = req.query; // Extract from query
        const favourite = await Favourites.findOne({ where: { userId, recipeId } });
        if (favourite) {
            res.json({ isFavourite: true });
        } else {
            res.json({ isFavourite: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
        console.log(error);
    }
});



module.exports = router