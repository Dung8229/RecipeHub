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

// Tìm kiếm nguyên liệu
const searchIngredients = async (query) => {
  try {
    const response = await axios.get(`/api/ingredients/search`, {
      params: { query },
    });
    console.log('Ingredient search results: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching ingredients:', error);
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
              name: ing.name,
              id: ing.id
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
                name: ing.name,
                id: ing.id
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

const createCompetitionEntry = async (formData, competitionId) => {
    try {
        let image;
        if (formData.imageFile) {
            image = await imageService.postImage(formData.imageFile);
            image = 'http://localhost:3000/' + image
            image = image.replace('\\', '/')
        } else if (formData.imageURL) {
            image = formData.imageURL;
        } else {
            throw new Error("Image is required.");
        }
  
        const recipeData = {
            ...formData,
            image,
            competitionId,
            ingredients: formData.ingredients.map(ing => ({
                amount: parseFloat(ing.amount),
                unit: ing.unit,
                name: ing.name,
                id: ing.id
            })),
        };
  
        const response = await axios.post(`${baseUrl}/competition-entry`, recipeData);
        return response.data;
    } catch (error) {
        console.error('Error creating competition entry:', error);
        throw error;
    }
  };

// Lấy công thức của người dùng cụ thể
const getMyRecipe = async (id) => {
  try {
    // Kiểm tra token tồn tại
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để tiếp tục');
    }

    const response = await axios.get(`${baseUrl}/my-recipe/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    // Xử lý các loại lỗi cụ thể
    if (!error.response) {
      throw new Error('Không thể kết nối đến server');
    }

    switch (error.response.status) {
      case 401:
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      case 403:
        throw new Error('Bạn không có quyền truy cập công thức này');
      case 404:
        throw new Error('Không tìm thấy công thức hoặc bạn không có quyền truy cập');
      default:
        console.error('Lỗi khi lấy công thức:', error);
        throw new Error('Có lỗi xảy ra khi lấy thông tin công thức');
    }
  }
};

//////////////////Service cho admin///////////////
// Lấy danh sách công thức
export const getAllRecipes = async () => {
  const token = window.localStorage.getItem('authToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(`${baseUrl}/admin/all`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Xóa công thức
export const deleteRecipe = async (recipeId) => {
  const token = window.localStorage.getItem('authToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.delete(`${baseUrl}/admin/${recipeId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};
//////////////////////////////////////////////////

export default { 
  getAllIngredients,  
  create,
  update,
  getDinnerRecipes,
  getRecipeDetails,
  addRecipeRating,
  addRecipeComment,
  getHighlightedRecipes,
  createCompetitionEntry,
  getMyRecipe,
  searchIngredients
}