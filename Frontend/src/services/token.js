import axios from 'axios'
import Cookies from 'js-cookie'

const baseUrl = '/api/token'

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

const isTokenExist = () => !!getToken();

const isTokenValid = async () => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    const response = await axios.get(`${baseUrl}/isValid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)

    return response.data.valid;
  } catch (error) {
    console.error("Error validating token:", error.response?.data || error.message);
    return false;
  }
};

const isTokenValidAdmin = async () => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    const response = await axios.get(`${baseUrl}/isValid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)

    return response.data.valid && response.data.user.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

const getUserInfo = async (token = getToken()) => {
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

    return response.data;
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

const logout = () => {
  window.localStorage.removeItem('token');
}

const updateToken = async () => {
  try {
    const token = window.localStorage.getItem('token');

    const response = await axios.post(`${baseUrl}/update-token`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    console.error('Error updating token:', error);
  }
}

export default {
  getUserInfo,
  getToken,
  isTokenExist,
  isTokenValid,
  isTokenValidAdmin,
}