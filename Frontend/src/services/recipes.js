// Gọi api liên quan recipe từ backend
import axios from 'axios'

const baseUrl = '/api/recipes'

export const getDinnerRecipes = async () => {
  const request = axios.get(`${baseUrl}/dinner`)
  return request.then(response => response.data)
}

// Lấy thông tin công thức, đánh giá và bình luận
export const getRecipeDetails = async (recipeId) => {
  try {
      const response = await axios.get(`${baseUrl}/${recipeId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching recipe details:', error);
      throw error;
  }
};

// Thêm đánh giá cho công thức và cập nhật xếp hạng trung bình
export const addRecipeRating = async (recipeId, userId, rating) => {
  try {
      const response = await axios.post(`${baseUrl}/${recipeId}/rating`, {
          userId,
          rating
      });
      return response.data;
  } catch (error) {
      console.error('Error adding recipe rating:', error);
      throw error;
  }
};

// Thêm bình luận cho công thức
export const addRecipeComment = async (recipeId, userId, commentText) => {
  try {
      const response = await axios.post(`${baseUrl}/${recipeId}/comment`, {
          userId,
          commentText
      });
      return response.data;
  } catch (error) {
      console.error('Error adding recipe comment:', error);
      throw error;
  }
};

// Lấy các công thức nổi bật (cái này chatgpt gợi ý thôi chứ mình không biết có cách nào khác không)
export const getHighlightedRecipes = async () => {
  try {
      const response = await axios.get(`${baseUrl}/highlighted`);
      return response.data;
  } catch (error) {
      console.error('Error fetching highlighted recipes:', error);
      throw error;
  }
};
