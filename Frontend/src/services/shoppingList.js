import axios from 'axios';

const baseUrl = '/api/shoppingList';

export const addShoppingListRecipes = async (userId, recipeId) => {
    try {
        const response = await axios.post(`${baseUrl}/recipes`, { userId, recipeId });
        return response.data;
    } catch (error) {
        console.error('Error fetching shopping list recipes:', error);
        throw error;
    }
};

export const deleteShoppingListRecipes = async (userId, recipeId) => {
    console.log('DELETE:', userId, recipeId);
    try {
        const response = await axios.delete(`${baseUrl}/recipes/${recipeId}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting shopping list recipes:', error);
        throw error;
    }
};

export const checkShoppingList = async (userId, recipeId) => {
    try {
        const response = await axios.get(`${baseUrl}/check`, { params: { userId, recipeId } });
        return response.data.isInList;
    } catch (error) {
        console.error('Error checking shopping list:', error);
        throw error;
    }
};