import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Thay đổi URL theo backend của bạn

// Thêm công thức vào shopping list
export const addRecipeToShoppingList = async (userID, recipeID) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/shoppinglist/${userID}/recipes`, { recipeID });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa công thức khỏi shopping list
export const removeRecipeFromShoppingList = async (userID, recipeID) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/shoppinglist/${userID}/recipes/${recipeID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách công thức trong shopping list
export const getShoppingListRecipes = async (userID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shoppinglist/${userID}/recipes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách nguyên liệu từ các công thức
export const getIngredientsFromRecipes = async (recipeIDs) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ingredients/from-recipes`, { recipeIDs });
    return response.data;
  } catch (error) {
    throw error;
  }
};