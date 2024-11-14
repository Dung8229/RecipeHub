import axios from 'axios';

const baseUrl = '/api/';

export const getRecipeComments = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/recipes/${recipeId}/comments`);
    return response.data;
};

export const addComment = async (userId, recipeId, comment) => {
    const response = await axios.post(`${baseUrl}/comment`, { userId, recipeId, comment });
    return response.data;
};