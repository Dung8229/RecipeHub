import React, { useEffect, useState } from 'react';
import { getFavourites, removeFavourite } from '../services/favourites.js';
import { useNavigate } from 'react-router-dom';
const FavouritesPage = () => {
    const [favourites, setFavourites] = useState([]);
    const navigate = useNavigate();
    let userId;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userIn = JSON.parse(storedUser);
        userId = userIn.id;
    }
    if (!storedUser) {
        navigate('/login');
    }


    useEffect(() => {
        const fetchData = async () => {
            const data = await getFavourites(userId);
            setFavourites(data);
        };

        fetchData();
    }, [userId]);

    const handleRemoveClick = async (recipeId) => {
        await removeFavourite(userId, recipeId);
        setFavourites(favourites.filter(fav => fav.recipeId !== recipeId));
    };

    return (
        <div className="min-h-screen bg-[#fcfaf8]">
            <div className="container mx-auto p-4">
                <div className="layout-content-container flex flex-col max-w-[960px] mx-auto">
                    <div className="flex justify-between items-center gap-3 p-4">
                        <h1 className="text-[32px] font-bold text-[#1c130d]">Saved Recipe</h1>
                    </div>

                    {/* Conditional rendering for no saved recipes */}
                    {favourites.length === 0 ? (
                        <div className="flex items-center justify-center h-[50vh]">
                            <p className="text-lg font-medium text-[#9c6d49]">
                                You have not saved any recipe.
                            </p>
                        </div>
                    ) : (
                        favourites.map(fav => (
                            <div key={fav.recipeId} className="flex items-center bg-[#ffffff] px-4 py-3 shadow-md mb-4 rounded-lg">
                                {/* Bên trái: Ảnh và thông tin */}
                                <div className="flex items-center gap-4 flex-grow">
                                    <div
                                        className="w-14 h-14 bg-cover bg-center rounded-lg"
                                        style={{ backgroundImage: `url(${fav.Recipe.image || '/path/to/placeholder.png'})` }}
                                    ></div>
                                    <div>
                                        <p className="text-[#1c130d] text-base font-medium">{fav.Recipe.title}</p>
                                        <p className="text-[#9c6d49] text-sm">{fav.Recipe.readyInMinutes} minutes to finish</p>
                                    </div>
                                </div>

                                {/* Nút Remove ở bên phải */}
                                <button
                                    className="text-base font-medium flex-shrink-0 ml-4"
                                    onClick={() => handleRemoveClick(fav.recipeId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavouritesPage;
