import React, { useState, useEffect } from 'react';
import { getAllRecipes, deleteRecipe } from '../../services/recipes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tải danh sách công thức');
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      try {
        await deleteRecipe(recipeId);
        fetchRecipes();
      } catch (err) {
        setError('Lỗi khi xóa công thức');
      }
    }
  };

  // Lọc recipes dựa trên searchTerm
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.userId.toString().includes(searchTerm)
  );

  // Tính toán recipes cho trang hiện tại
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex border rounded-lg overflow-hidden border-black w-full max-w-md bg-orange-50">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes"
            className="px-4 py-2 w-full text-gray-500 focus:outline-none bg-orange-50"
          />
          <button className="bg-primary px-4 py-2">
            <FontAwesomeIcon icon={faSearch} className="text-white" />
          </button>
        </div>
      </div>

      {/* Recipe Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">UserID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ready In Minutes</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Servings</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{recipe.userId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{recipe.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{recipe.readyInMinutes}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{recipe.servings}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-orange-500 hover:text-orange-700 font-medium bg-orange-50 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`w-8 h-8 rounded-full ${
              currentPage === number 
                ? 'bg-orange-100 text-orange-500' 
                : 'hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default RecipeList;
