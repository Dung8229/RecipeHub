import axios from 'axios';
import tokenService from './token'

const baseUrl = '/api/shoppingList';

export const addShoppingListRecipes = async (userId, recipeId) => {
    const token = tokenService.getToken()

    try {
        const response = await axios.post(`${baseUrl}/recipes`, { userId, recipeId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching shopping list recipes:', error);
        throw error;
    }
};

export const deleteShoppingListRecipes = async (userId, recipeId) => {
    console.log('DELETE:', userId, recipeId);
    const token = tokenService.getToken()
    try {
        const response = await axios.delete(`${baseUrl}/recipes/${recipeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
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