// Gọi api liên quan recipe từ backend
import axios from 'axios'

const baseUrl = '/api/recipes'

export const getDinnerRecipes = async () => {
  const request = axios.get(`${baseUrl}/dinner`)
  return request.then(response => response.data)
}

