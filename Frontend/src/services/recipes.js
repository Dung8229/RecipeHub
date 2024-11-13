// Gọi api liên quan recipe từ backend
import axios from 'axios'

const baseUrl = '/api/recipes'

export const getDinnerRecipes = async () => {
  const request = axios.get(`${baseUrl}/dinner`)
  return request.then(response => response.data)
}


export const getRecipeById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await axios.post(baseUrl, recipeData);
  return response.data;
};

