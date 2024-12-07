import axios from 'axios'
import tokenService from './token'

const baseUrl = '/api/users'

/////////////////Services cho admin/////////////////
// Lấy danh sách người dùng
const getAllUsers = async () => {
    const token = tokenService.getToken();
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.get(`${baseUrl}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Xóa người dùng
const deleteUser = async (userId) => {
    const token = tokenService.getToken();
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.delete(`${baseUrl}/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

const getUserData = async (userId) => {
    const token = tokenService.getToken();
    // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra xem có phải admin không
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }

  try {
    const response = await axios.get(`${baseUrl}/${userId}`, config);
    console.log('User: ', response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching user id:', error);
    throw error;
  }
}

export default {
  getAllUsers,
  deleteUser,
  getUserData,
}
