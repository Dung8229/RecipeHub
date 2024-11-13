import axios from 'axios';

const baseUrl = '/api/recipes';

export const getRecipeIngredients = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/${recipeId}/ingredients`);
    return response.data;
};