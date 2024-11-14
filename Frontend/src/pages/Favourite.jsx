import React, { useEffect, useState } from 'react';
import { getFavourites, removeFavourite } from '../services/favourites.js';

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState([]);
    const userId = 1; // Giả sử userId là 1, bạn có thể thay thế bằng giá trị thực tế

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
        <div>
            {/* <h1>My Favourite Recipes</h1>
            <ul>
                {favourites.map(fav => (
                    <li key={fav.recipeId}>
                        <h2>{fav.Recipe.title}</h2>
                        {fav.Recipe.image && <img src={fav.Recipe.image} alt={fav.Recipe.title} />}
                        <p>{fav.Recipe.summary}</p>
                        <button onClick={() => handleRemoveClick(fav.recipeId)}>Remove</button>
                    </li>
                ))}
            </ul> */}
            <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4ece7] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c130d]">
                        <div className="size-4">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <h2 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em]">RecipeHub</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Discover</a>
                        <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Create</a>
                        <button className="flex items-center justify-center h-10 px-4 bg-[#f4ece7] rounded-xl">
                            Profile
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://cdn.usegalileo.ai/stability/e1e46f42-a6d9-448c-b68e-9a7c208382f3.png')" }}></div>
                    </div>
                </header>

                <main className="px-40 py-5 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[960px]">
                        <div className="flex justify-between items-center gap-3 p-4">
                            <h1 className="text-[32px] font-bold text-[#1c130d]">Saved Recipe</h1>
                            <button className="bg-[#f4ece7] text-[#1c130d] h-8 px-4 rounded-xl">New recipe</button>
                        </div>

                        {favourites.map(fav => (
                            <div className="flex justify-between items-center bg-[#fcfaf8] px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-full bg-cover rounded-lg" style={{ backgroundImage: `url(${fav.Recipe.image})` }}></div>
                                    <div>
                                        <p className="text-[#1c130d] text-base font-medium">{fav.Recipe.title}</p>
                                        <p className="text-[#9c6d49] text-sm">{fav.Recipe.readyInMinutes} minutes to finish</p>
                                    </div>
                                </div>
                                <button className="text-base font-medium" onClick={() => handleRemoveClick(fav.recipeId)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FavouritesPage;