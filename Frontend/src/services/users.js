import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const getUserInfo = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

export default { getAll, getUserInfo }