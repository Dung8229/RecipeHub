const express = require('express');
const router = express.Router();
const RecipeInstruction = require('../models/recipe_instruction');
//Add route liên quan đến ID công thức
// Route để lấy tất cả các bước hướng dẫn cua công thức id
router.get('recipes/:id', async (req, res) => {
    try {
        const instruction = await RecipeInstruction.findByPk(req.params.id);
        if (instruction) {
            res.json(instruction);
        } else {
            res.status(404).json({ error: 'Instruction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;