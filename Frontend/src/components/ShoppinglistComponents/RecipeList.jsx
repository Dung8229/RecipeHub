import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RecipeList = ({ recipes, handleRemoveRecipe, handleRemoveAllRecipes, handleServingsChange, isDirty, handleSaveChanges }) => {
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
        {recipes.length === 0 ? (
          // Hiển thị thông báo nếu không có công thức nào được chọn
          <div className="text-center text-gray-500">
            No recipes selected
          </div>
        ) : (
          // Render danh sách các recipe
          recipes.map((recipe) => (
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
                  <h3 className="text-[#141414] text-base font-medium">
                    <Link to={`/recipes/${recipe.id}/information`} className="hover:underline">
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-[#707070] text-sm">by {recipe.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={recipe.servings}
                  onChange={(e) => {
                    const newServings = parseInt(e.target.value, 10);
                    if (newServings > 0 && e.target.value !== '') {
                      handleServingsChange(recipe.id, newServings);
                    }
                  }}
                  min="1"
                  step="1"
                  className="w-20 text-center border border-gray-300 rounded-md p-1"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();  // Ngừng propagation để không trigger Link
                    handleRemoveRecipe(recipe.id);
                  }}
                  className="text-black hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-around items-center">
        <button
          onClick={handleAddRecipe}
          className="w-1/3 h-12 bg-[#ff8c00] rounded-3xl text-white font-bold hover:bg-[#e67e00] transition-colors"
        >
          Add Recipe
        </button>
        <button
          onClick={handleRemoveAllRecipes}
          className="w-1/3 h-12 bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold hover:bg-[#d8d8d8] transition-colors"
        >
          Clear All
        </button>
        {isDirty && (
          <button
            onClick={handleSaveChanges}
            className="w-1/3 h-12 bg-blue-500 rounded-3xl text-white  font-bold hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeList; 