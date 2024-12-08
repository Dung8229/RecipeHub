import axios from 'axios';
import tokenService from '../services/token'

const baseUrl = '/api/';

export const getRecipeComments = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/recipes/${recipeId}/comments`);
    console.log("Get comments result: ", response.data)
    return response.data;
};

export const addComment = async (recipeId, commentText) => {
    const token = tokenService.getToken();
    const response = await axios.post(`${baseUrl}/recipes/${recipeId}/comments`, {

        commentText,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};
