import axios from 'axios';
const baseUrl = '/api/comments';

// Lấy token từ localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  return user ? user.token : null;
};

const commentService = {
  // Lấy danh sách comments có phân trang và tìm kiếm
  getComments: async (page = 1, searchTerm = '') => {
    try {
      const token = getToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(
        `${baseUrl}?page=${page}&search=${searchTerm}`, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Xóa comment
  deleteComment: async (commentId) => {
    try {
      const token = getToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.delete(
        `${baseUrl}/${commentId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService; 