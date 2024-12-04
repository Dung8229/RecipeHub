// Gọi api liên quan recipe từ backend
import axios from 'axios'

const baseUrl = '/api/recipes'

// export const getDinnerRecipes = async () => {
//   const request = axios.get(`${baseUrl}/dinner`)
//   return request.then(response => response.data)
// }


export const getRecipeById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await axios.post(baseUrl, recipeData);
  return response.data;
};

export const getTrendingRecipes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/trending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending recipes:', error);
    throw error;
  }
};

export const getLatestRecipes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest recipes:', error);
    throw error;
  }
};
