import axios from 'axios';

const baseUrl = '/api/users';

export const getFavourites = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/favourites`);
    return response.data;
};

export const addFavourite = async (userId, recipeId) => {
    const response = await axios.post(baseUrl, { userId, recipeId });
    return response.data;
};

export const removeFavourite = async (userId, recipeId) => {
    await axios.delete(baseUrl, { data: { userId, recipeId } });
};

export const checkFavourite = async (userId, recipeId) => {
    const response = await axios.get(`${baseUrl}/check`, { data: { userId, recipeId } });
    return response.data.isFavourite;
};