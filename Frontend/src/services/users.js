import axios from 'axios'

const baseUrl = '/api/users'

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
    const token = window.localStorage.getItem('authToken');
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