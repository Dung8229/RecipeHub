const express = require('express');
const router = express.Router();
const Favourites = require('../models/favourites');
const Recipe = require('../models/recipe');
// Route để lấy danh sách các công thức đã lưu
// router.get('/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const favourites = await Favourites.findAll({
//             where: { userId },
//             include: [
//                 {
//                     model: Recipe,
//                     attributes: ['id', 'title'],
//                 },
//             ],
//         });
//         res.json(favourites);
//     } catch (error) {
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// });
// Route để lấy danh sách yêu thích của người dùng theo userId
router.get('/:userId/favourites', async (req, res) => {
    try {
        const userId = req.params.userId;
        const favourites = await Favourites.findAll({
            where: { userId },
            include: [
                {
                    model: Recipe,
                    attributes: ['id', 'title'],
                },
            ],
        });
        if (favourites.length > 0) {
            res.json(favourites);
        } else {
            res.status(404).json({ error: 'No favourites found' });
        }
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Route để thêm công thức vào danh sách yêu thích
router.post('/', async (req, res) => {
    try {
        const { userId, recipeId } = req.body;
        const favourite = await Favourites.create({ userId, recipeId })
        res.status(201).json(favourite)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
});

// Route để xóa công thức khỏi danh sách yêu thích
router.delete('/', async (req, res) => {
    try {
        const { userId, recipeId } = req.body;
        const favourite = await Favourites.findOne({ where: { userId, recipeId } });
        if (favourite) {
            await favourite.destroy();
            res.status(204).end()
        } else {
            res.status(404).json({ error: 'Favourite not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Cannot delete recipe' })
    }
});

// Route để kiểm tra công thức có trong danh sách yêu thích hay không
router.get('/:userId/:recipeId', async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        const favourite = await Favourites.findOne({ where: { userId, recipeId } });
        if (favourite) {
            res.json({ isFavourite: true });
        } else {
            res.json({ isFavourite: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router