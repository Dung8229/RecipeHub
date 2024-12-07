import axios from 'axios';

const baseUrl = '/api/';

export const getRecipeComments = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/recipes/${recipeId}/comments`);
    return response.data;
};

export const addComment = async (recipeId, commentText) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${baseUrl}/recipes/${recipeId}/comments`, {

        commentText,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};
