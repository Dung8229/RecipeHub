import axios from 'axios';

const baseUrl = '/api/recipes';

export const getRecipeInstructions = async (recipeId) => {
    const response = await axios.get(`${baseUrl}/${recipeId}/instructions`);
    return response.data;
};