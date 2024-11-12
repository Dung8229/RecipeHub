import axios from 'axios'
import imageService from './image'

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

const getDetail = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}`)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

const getLeaderboard = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}/leaderboard`)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition leaderboard id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

// Hàm tạo competition mới
const create = async (title, imageFile = null, imageURL = "", description, detailDescription, startDate, endDate, prize) => {
    try {
      // Kiểm tra nếu có file ảnh thì upload và lấy đường dẫn ảnh
      let image;
      if (imageFile) {
        // Gọi API để upload ảnh và lấy đường dẫn
        image = await imageService.postImage(imageFile); // Giả sử imageService.postImage là hàm upload ảnh
        image = 'http://localhost:3000/' + image
      } else if (imageURL) {
        // Nếu không có file, sử dụng imageURL đã được cung cấp
        image = imageURL;
      } else {
        // Nếu không có cả file ảnh và imageURL, trả về lỗi
        throw new Error("Image is required.");
      }
  
      // Tạo dữ liệu competition
      const competitionData = {
        title,
        image, // Đường dẫn ảnh đã được upload hoặc URL ảnh
        description,
        detailDescription,
        startDate,
        endDate,
        prize,
      };
  
      // Gửi yêu cầu tạo competition lên server
      const response = await axios.post(baseUrl, competitionData);
      console.log('Competition created successfully:', response.data);

      return response.data
    } catch (error) {
      console.error('Error creating competition:', error);
    }
};

const deleteCompetition = async (id) => {
    const token = window.localStorage.getItem('authToken');
    // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra xem có phải admin không
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }

    try {
        const response = await axios.delete(`${baseUrl}/${id}`, config); // Gửi thêm token qua config
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export default { getAll, getDetail, getLeaderboard, create, deleteCompetition }