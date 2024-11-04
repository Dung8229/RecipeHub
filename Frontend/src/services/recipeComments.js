import axios from 'axios';

const baseUrl = '/api/recipeComments';

export const getRecipeComment = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/recipe/${recipeId}`);
    return response.data;
};

export const addComment = async (userId, recipeId, comment) => {
    const response = await axios.post(`${baseUrl}/comment`, { userId, recipeId, comment });
    return response.data;
};