import React from 'react';

interface Recipe {
  image: string | undefined;
  id: number;
  title: string;
  readyInMinutes: number;
  rating: number;
  username: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onRecipeSelect,
  isLoading,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  const formatRating = (rating: any): string => {
    const numRating = Number(rating);
    return !isNaN(numRating) ? numRating.toFixed(1) : '0.0';
  };

  return (
    <div className="w-3/4">
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-lg font-semibold text-gray-500">Loading...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-lg font-semibold text-gray-500">
            No recipes found.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105 border-2 border-[#ff8c00]"
                onClick={() => onRecipeSelect(recipe)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold overflow-hidden text-ellipsis"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      height: '63px',
                    }}
                  >
                    {recipe.title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-[#8a7060] flex items-center gap-4">
                      <i className="fas fa-clock"></i> {recipe.readyInMinutes} min
                    </p>
                    <p className="text-sm text-[#8a7060] flex items-center gap-4">
                      <i className="fas fa-user"></i> By {recipe.username}
                    </p>
                    <p className="text-sm text-[#8a7060] flex items-center gap-4">
                      <i className="fas fa-star text-yellow-500"></i>{' '}
                      {formatRating(recipe.rating)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#ff8c00] text-white hover:bg-[#e67e00]'
              } transition-colors`}
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#ff8c00] text-white hover:bg-[#e67e00]'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeList;
