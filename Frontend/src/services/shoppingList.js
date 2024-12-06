import axios from 'axios';

const baseUrl = '/api/shoppinglist';

export const addShoppingListRecipes = async () => {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.post(`${baseUrl}/recipes`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching shopping list recipes:', error);
        throw error;
    }
};

export const deleteShoppingListRecipes = async () => {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.delete(`${baseUrl}/recipes`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting shopping list recipes:', error);
        throw error;
    }
};

export const checkShoppingList = async (userId, recipeId) => {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${baseUrl}/recipes/${recipeId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error checking shopping list:', error);
        throw error;
    }
};