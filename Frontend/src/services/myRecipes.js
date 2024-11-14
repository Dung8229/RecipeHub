import axios from 'axios';
const baseUrl = '/api/users';

export const getMyRecipes = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/recipes`);
    return response.data;
}