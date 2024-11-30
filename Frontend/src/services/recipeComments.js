import axios from 'axios';

const baseUrl = '/api/';

export const getRecipeComments = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/recipes/${recipeId}/comments`);
    return response.data;
};

export const addComment = async (userId, recipeId, commentText) => {
    const response = await axios.post(`${baseUrl}/recipes/${recipeId}/comments`, {
        userId,
        commentText,
    });
    return response.data;
};
