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
      <h1>My Favourite Recipes</h1>
      <ul>
        {favourites.map(fav => (
          <li key={fav.recipeId}>
            <h2>{fav.Recipe.title}</h2>
            {fav.Recipe.image && <img src={fav.Recipe.image} alt={fav.Recipe.title} />}
            <p>{fav.Recipe.summary}</p>
            <button onClick={() => handleRemoveClick(fav.recipeId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavouritesPage;