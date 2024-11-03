import axios from 'axios'

const baseUrl = '/api/users'

// const getAll = async () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

// export default { getAll }

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
    try {
        const response = await axios.delete(`${baseUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};