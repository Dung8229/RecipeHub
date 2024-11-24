import axios from 'axios'

const baseUrl = '/api/token'

const getToken = () => {
  const token = window.localStorage.getItem('token'); // Lấy token từ localStorage
  return token
}

const isTokenExist = () => {
  const token = getToken()
  if (!token) {
    return false
  }
  return true
}

const getUserInfo = async (token = window.localStorage.getItem('token')) => {
  if (!token) {
    console.error('Token is missing. Please log in.');
    return null;
  }

  try {
    const response = await axios.get(`${baseUrl}/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Trả về dữ liệu từ response
    return response.data; // Dữ liệu đã được parse sẵn
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error('Forbidden: Invalid token.');
    } else if (error.response && error.response.status === 401) {
      console.error('Unauthorized: Please log in again.');
    } else {
      console.error('Error fetching user info:', error.message);
    }
    return null;
  }
};

export default {
  getUserInfo,
  getToken,
  isTokenExist
}