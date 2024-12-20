import axios from 'axios'
import tokenService from './token'
import Cookies from 'js-cookie'

const baseUrl = '/api/users'

const getToken = () => {
    // First check localStorage
    const token = window.localStorage.getItem('token');
    if (token) {
      return token;
    }
  
    // If not in localStorage, get from cookie
    const tokenFromCookie = Cookies.get('token');
    if (tokenFromCookie) {
      return tokenFromCookie;
    }
    console.log("token from cookie: ", tokenFromCookie)
  
    return null;
  }

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

export const getUserInfo = async () => {
    const token = window.localStorage.getItem('token');
    // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra xem có phải admin không
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.get(`${baseUrl}/${userId}`, config); // Thêm config vào đây
        console.log('User Info JSON type: ', response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

// Function to update user's image URL
export const updateUserImage = async (userId, imageUrl) => {
    const token = window.localStorage.getItem('token'); // Get the token from localStorage
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.put(`${baseUrl}/${userId}/image`, { imageUrl }, config);
        return response.data;
    } catch (error) {
        console.error('Error updating user image:', error);
        throw error;
    }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const token = window.localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.put(`${baseUrl}/${userId}/password`, { currentPassword, newPassword }, config);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
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

const login = async ( email, password ) => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to log in');
    }
    return response.json();
};

const register = async ({ username, email, password }) => {
    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }
  
      return await response.json(); // Trả về dữ liệu phản hồi từ API
    } catch (error) {
      console.error('Error login:', error);
      throw error; // Ném lỗi để xử lý ở component
    }
};

export default {
  getAllUsers,
  deleteUser,
  getUserData,
  login, 
  register,
}
