const express = require('express');
const router = express.Router();
const RecipeInstruction = require('../models/recipe_instruction');

// Route để lấy tất cả các bước hướng dẫn của một công thức nấu ăn theo ID
router.get('/recipes/:id/instructions', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const instructions = await RecipeInstruction.findAll({
            where: { recipeId }
        });
        if (instructions.length > 0) {
            res.json(instructions);
        } else {
            res.status(404).json({ error: 'Instructions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

//Add route post to add an instruction

module.exports = router;