import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const RecipeList = ({ recipes, handleRemove }) => {
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    navigate('/recipes/search', { 
      state: { 
        fromShoppingList: true 
      } 
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-[#141414] text-[22px] font-bold font-['Plus Jakarta Sans']">
          Selected Recipes
        </h2>
      </div>

      <div className="space-y-2">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="h-[72px] px-4 py-2 bg-neutral-100 flex justify-between items-center 
                      border border-transparent hover:border-primary rounded-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8e8e8] rounded-lg flex items-center justify-center">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-[#141414] text-base font-medium">{recipe.title}</h3>
                <p className="text-[#707070] text-sm">by {recipe.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(recipe.id)}
              className="text-black hover:text-red-500 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-2">
        <button
          onClick={handleAddRecipe}
          className="w-full h-12 bg-[#ff8c00] rounded-3xl text-white font-bold hover:bg-[#e67e00] transition-colors"
        >
          Add Recipe
        </button>
        <button
          onClick={() => handleRemove()}
          className="w-full h-12 bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold hover:bg-[#d8d8d8] transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default RecipeList; 