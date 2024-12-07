import * as jwtDecode from 'jwt-decode';

export const getUserFromToken = () => {
    const token = window.localStorage.getItem('token');
    try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);
        return decoded; // Trả về payload
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
// import { decode as jwtDecode } from 'jwt-decode';

// export const getUserFromToken = () => {
//     const token = window.localStorage.getItem('token');
//     if (!token) return null;

//     try {
//         const decoded = jwtDecode(token);
//         console.log('Decoded Token:', decoded);
//         return decoded; // Trả về payload
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         return null;
//     }
// };
