import React from 'react';

interface Recipe {
  image: string | undefined;
  id: number;
  title: string;
  readyInMinutes: number;
  // difficulty: string;
  rating: number;
  username: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  showAllRecipes: boolean;
  onViewMore: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, showAllRecipes, onViewMore, onRecipeSelect }) => {
  const displayedRecipes = showAllRecipes ? recipes : recipes.slice(0, 8);
  const formatRating = (rating: any): string => {
    const numRating = Number(rating);
    return !isNaN(numRating) ? numRating.toFixed(1) : '0.0';
  };
  return (
    <div className="w-3/4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105 border-2 border-[#ff8c00]" onClick={() => onRecipeSelect(recipe)}>
            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              <div className="space-y-1">
                <p className="text-sm text-[#8a7060] flex items-center gap-4">
                  <i className="fas fa-clock"></i> {recipe.readyInMinutes} min
                </p>
                {/* <p className="text-sm text-[#8a7060] flex items-center gap-4">
                  <i className="fas fa-chart-line"></i> {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </p> */}

                <p className="text-sm text-[#8a7060] flex items-center gap-4">
                  <i className="fas fa-user"></i> By {recipe.username}
                </p>
                <p className="text-sm text-[#8a7060] flex items-center gap-4">
                  <i className="fas fa-star text-yellow-500"></i> {formatRating(recipe.rating)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {recipes.length > 8 && (
        <button
          onClick={onViewMore}
          className="mt-6 px-4 py-2 bg-[#ff8c00] text-white rounded-full hover:bg-[#e67e00] transition-colors"
        >
          {showAllRecipes ? 'Show Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default RecipeList;
