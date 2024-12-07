import axios from 'axios';

const baseUrl = '/api/ingredient'

const search = async (query) => {
  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: { query },
    });
    console.log('Ingredient search results: ', response.data)
    return response.data
  } catch (error) {
    console.error('Error searching ingredients:', error);
  }
};

export default {
  search,
}
