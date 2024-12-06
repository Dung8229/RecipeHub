import axios from 'axios'

const baseUrl = '/api/users'

/////////////////Services cho admin/////////////////
// Lấy danh sách người dùng
export const getAllUsers = async () => {
    const token = window.localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.get(`${baseUrl}/admin/all`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
    const token = window.localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await axios.delete(`${baseUrl}/admin/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
////////////////////////////////////////////////////