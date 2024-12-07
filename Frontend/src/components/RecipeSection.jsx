import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingRecipes, getLatestRecipes } from '../services/recipes'; // Ensure these functions are correctly imported

const RecipeSection = ({ title, type }) => {
  const [recipes, setRecipes] = useState([]); // Initialize as an empty array
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let fetchedRecipes;
        if (type === 'trending') {
          fetchedRecipes = await getTrendingRecipes();
        } else if (type === 'latest') {
          fetchedRecipes = await getLatestRecipes();
        }
        setRecipes(fetchedRecipes);
        console.log('FETCHED RECIPES: ', fetchedRecipes)
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [type]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipes/${id}/information`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl`} style={{ color: i <= rating ? '#f74002' : 'gray' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="py-8 relative">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex overflow-hidden space-x-4" ref={scrollRef} style={{ scrollSnapType: 'x mandatory' }}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 cursor-pointer"
            style={{ width: 'calc(100% / 3)' }} // Adjust the width to show 3 recipes at a time
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{recipe.title}</h3>
              <div className="flex items-center">
                {renderStars(recipe.RecipeAverageRating?.averageUserRating || 0)}
                <span className="ml-2 text-base text-gray-600">
                  ({recipe.RecipeAverageRating?.totalUserRatings || 0})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white px-2 py-3 rounded flex items-center justify-center"
        onClick={scrollLeft}
      >
        <span className="text-2xl">&lt;</span>
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white px-2 py-3 rounded flex items-center justify-center"
        onClick={scrollRight}
      >
        <span className="text-2xl">&gt;</span>
      </button>

    </section>
  );
};

export default RecipeSection;