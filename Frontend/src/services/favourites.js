import axios from 'axios';

const baseUrl = '/api/users';

export const getFavourites = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/favourites`);
    return response.data;
};

export const addFavourite = async (userId, recipeId) => {
    const response = await axios.post(`${baseUrl}/${userId}/fav`, { userId, recipeId });
    return response.data;
};

export const removeFavourite = async (userId, recipeId) => {
    await axios.delete(`${baseUrl}/${userId}/del`, {
        data: { recipeId } // Send recipeId in the request body
    });
};

export const checkFavourite = async (userId, recipeId) => {
    const response = await axios.get(`${baseUrl}/${userId}/check`, {
        params: { recipeId } // Use query parameters
    });
    return response.data.isFavourite;
};