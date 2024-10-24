import axios from 'axios'

const baseUrl = '/api/competitions'

const getAll = async (status) => {
  try {
      // Gửi yêu cầu GET tới backend với query parameter status
      const response = await axios.get(baseUrl, {
          params: { status }
      });

      // Trả về danh sách các cuộc thi
      return response.data;
  } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

export default { getAll }