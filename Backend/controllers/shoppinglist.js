const shoppingListRouter = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');

// Giả định bạn có một mảng để lưu trữ dữ liệu tạm thời
let shoppingList = [];

// Lấy danh sách công thức trong shopping list
shoppingListRouter.post('/:userId/recipes', (request, response) => {
    try {
        const { userId } = request.params;
        const { recipeId } = request.body;
        
        // Kiểm tra xem công thức đã tồn tại chưa
        const exists = shoppingList.some(item => item.userId === userId && item.recipeId === recipeId);
        
        if (!exists) {
            shoppingList.push({ userId, recipeId });
            response.status(201).json({ message: 'Recipe added to shopping list' });
        } else {
            response.status(409).json({ message: 'Recipe already exists in shopping list' });
        }
    } catch (error) {
        logger.error('Error adding recipe to shopping list:', error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

// Thêm công thức vào shopping list
shoppingListRouter.post('/:userId/recipes', (request, response) => {
    try {
        const { userId } = request.params;
        const { recipeId } = request.body;
        shoppingList.push({ userId, recipeId });
        response.status(201).json({ message: 'Recipe added to shopping list' });
    } catch (error) {
        logger.error('Error adding recipe to shopping list:', error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

// Xóa công thức khỏi shopping list
shoppingListRouter.delete('/:userId/recipes/:recipeId', (request, response) => {
    try {
        const { userId, recipeId } = request.params;
        shoppingList = shoppingList.filter(item => !(item.userId === userId && item.recipeId === recipeId));
        response.json({ message: 'Recipe removed from shopping list' });
    } catch (error) {
        logger.error('Error removing recipe from shopping list:', error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = shoppingListRouter;