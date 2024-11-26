import axios from 'axios'

const baseUrl = '/api/token'

const getToken = () => {
  const token = window.localStorage.getItem('token'); // Lấy token từ localStorage
  return token
}

const isTokenExist = () => !!getToken();

const isTokenValid = async () => {
  try {
    const token = window.localStorage.getItem("token");

    // Gửi yêu cầu kiểm tra token
    const response = await axios.get(`${baseUrl}/isValid`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });
    console.log(response.data)

    return response.data.valid; // Trả về kết quả kiểm tra từ server
  } catch (error) {
    console.error("Error validating token:", error.response?.data || error.message);
    return false; // Token không hợp lệ
  }
};

const isTokenValidAdmin = async () => {
  try {
    const token = window.localStorage.getItem("token");

    const response = await axios.get(`${baseUrl}/isValid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)

    return response.data.valid && response.data.user.role === "admin"; // Kiểm tra role
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

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
  isTokenExist,
  isTokenValid,
  isTokenValidAdmin,
}