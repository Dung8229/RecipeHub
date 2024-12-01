import axios from 'axios';

const baseUrl = '/api/shoppinglist'

// Thêm công thức vào shopping list
// export const addRecipeToShoppingList = async (userID, recipeID) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/shoppinglist/${userID}/recipes`, { recipeID });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// Xóa công thức khỏi shopping list
const removeRecipe = async (recipeId) => {
  const token = window.localStorage.getItem('token');
  try {
    const response = await axios.delete(`${baseUrl}/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error remove a recipe')
    throw error;
  }
};

const removeAllRecipes = async () => {
  const token = window.localStorage.getItem('token');
  try {
    const response = await axios.delete(`${baseUrl}/recipes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error remove all recipes')
    throw error;
  }
}

// Lấy danh sách công thức trong shopping list
const getRecipes = async () => {
  const token = window.localStorage.getItem('token');
  try {
    const response = await axios.get(`${baseUrl}/recipes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });
    console.log('Sl recipes: ', response.data.recipes)
    return response.data.recipes;
  } catch (error) {
    console.error('Error getting shopping list recipes')
    throw error;
  }
};

// Lấy danh sách nguyên liệu từ các công thức
const getIngredients = async (servingsData) => {
  const token = window.localStorage.getItem('token');
  try {
    // Gửi data servings vào API cùng với header Authorization
    const response = await axios.post(
      `${baseUrl}/ingredients`, 
      { servings: servingsData }, // Truyền body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('ingredients: ', response.data.ingredients);
    return response.data.ingredients;
  } catch (error) {
    console.error('Error getting ingredients', error);
    throw error;
  }
};

export default {
  getRecipes,
  removeRecipe,
  removeAllRecipes,
  getIngredients,
}