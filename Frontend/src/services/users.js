import axios from 'axios'

const baseUrl = '/api/users'

const getToken = () => {
    const token = window.localStorage.getItem('token'); // Lấy token từ localStorage
    return token
}

// Lấy danh sách người dùng
export const getUsers = async () => {
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
    const token = window.localStorage.getItem('token');
    // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra xem có phải admin không
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }

    try {
        const response = await axios.delete(`${baseUrl}/${userId}`, config); // Gửi thêm token qua config
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