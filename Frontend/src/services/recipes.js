// Gọi api liên quan recipe từ backend
import axios from 'axios'
import imageService from './image'

const baseUrl = '/api/recipes'

const getDinnerRecipes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dinner`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dinner recipes:', error);
      throw error;
    }
};

// Lấy thông tin công thức, đánh giá và bình luận
const getRecipeDetails = async (recipeId) => {
  try {
      const response = await axios.get(`${baseUrl}/${recipeId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching recipe details:', error);
      throw error;
  }
};

// Thêm đánh giá cho công thức và cập nhật xếp hạng trung bình
const addRecipeRating = async (recipeId, userId, rating) => {
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
const addRecipeComment = async (recipeId, userId, commentText) => {
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
const getHighlightedRecipes = async () => {
  try {
      const response = await axios.get(`${baseUrl}/highlighted`);
      return response.data;
  } catch (error) {
      console.error('Error fetching highlighted recipes:', error);
      throw error;
  }
};

// Lấy tất cả nguyên liệu
const getAllIngredients = async () => {
    try {
        const response = await axios.get(`${baseUrl}/ingredients`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
};

// Tạo công thức mới
const create = async (formData) => {
  try {
      // Xử lý ảnh
      let image;
      if (formData.imageFile) {
          image = await imageService.postImage(formData.imageFile);
          image = 'http://localhost:3000/' + image
          image = image.replace('\\', '/')
      } else if (formData.imageURL) {
          image = formData.imageURL;
      } else {
          throw new Error("Image is required. ");
      }

      // Chuẩn bị dữ liệu gửi lên server
      const recipeData = {
          title: formData.title,
          image,
          summary: formData.summary,
          readyInMinutes: parseInt(formData.readyInMinutes),
          servings: parseInt(formData.servings),
          difficulty: formData.difficulty,
          ingredients: formData.ingredients.map(ing => ({
              amount: parseFloat(ing.amount),
              unit: ing.unit,
              name: ing.name
          })),
          instructions: formData.instructions.map(inst => ({
              stepNumber: inst.stepNumber,
              content: inst.content
          })),
          tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      const response = await axios.post(baseUrl, recipeData);
      return response.data;
  } catch (error) {
      console.error('Error creating new recipe', error);
      throw error;
  }
};

// Cập nhật công thức
const update = async (id, formData) => {
    try {
        // Xử lý ảnh
        let image;
        if (formData.imageFile) {
            image = await imageService.postImage(formData.imageFile);
            image = 'http://localhost:3000/' + image
            image = image.replace('\\', '/')
        } else if (formData.imageURL) {
            image = formData.imageURL;
        } else if (formData.image) {
            image = formData.image; // Giữ nguyên ảnh cũ nếu không có ảnh mới
        } else {
            throw new Error("Image is required.");
        }
  
        // Chuẩn bị dữ liệu gửi lên server
        const recipeData = {
            title: formData.title,
            image,
            summary: formData.summary,
            readyInMinutes: parseInt(formData.readyInMinutes),
            servings: parseInt(formData.servings),
            difficulty: formData.difficulty,
            ingredients: formData.ingredients.map(ing => ({
                amount: parseFloat(ing.amount),
                unit: ing.unit,
                name: ing.name
            })),
            instructions: formData.instructions.map(inst => ({
                stepNumber: inst.stepNumber,
                content: inst.content
            })),
            tags: formData.tags.filter(tag => tag.trim() !== '')
        };
  
        const response = await axios.put(`${baseUrl}/${id}`, recipeData);
        return response.data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

// Thêm hàm để lấy chi tiết một công thức
const getRecipeById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
};

export default { 
  getAllIngredients,  
  create,
  update,
  getDinnerRecipes,
  getRecipeDetails,
  addRecipeRating,
  addRecipeComment,
  getHighlightedRecipes,
  getRecipeById
}