import axios from 'axios';

const baseUrl = '/api/recipes';

export const getRecipeRatings = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/${recipeId}/ratings`);
    return response.data;
};

export const getUserRating = async (userId, recipeId) => {
    const response = await axios.get(`${baseUrl}/${recipeId}/ratings/${userId}`);
    return response.data;
};

export const addOrUpdateRating = async (userId, recipeId, rating) => {
    const response = await axios.post(`${baseUrl}/${recipeId}/ratings`, {
        userId,
        rating,
    });
    return response.data;
};
export const updateRating = async (userId, recipeId, rating) => {
    const response = await axios.put(`${baseUrl}/${recipeId}/ratings`, {
        userId,
        rating,
    });
    return response.data;
};

