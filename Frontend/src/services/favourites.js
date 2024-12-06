import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseUrl = '/api/users';


export const getFavourites = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/favourites`);
    return response.data;
};

export const addFavourite = async (userId, recipeId) => {
    try {
        const response = await axios.post(`${baseUrl}/${userId}/fav`, { userId, recipeId });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('You need to login to add favourites');
            if (navigate) navigate('/login');
        }
    }


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
    console.log('WORKED');
    return response.data.isFavourite;
};