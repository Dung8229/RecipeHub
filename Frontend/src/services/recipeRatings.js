import axios from 'axios';

const baseUrl = '/api/recipes';

export const getRecipeRatings = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/${recipeId}/ratings`);
    return response.data;
};