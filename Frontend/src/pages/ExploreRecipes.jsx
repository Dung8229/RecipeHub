import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/ExploreRecipeComponents/Sidebar';
import RecipeList from '../components/ExploreRecipeComponents/RecipeList';
import { useNavigate } from 'react-router-dom';
import qs from "qs";
import { useLocation } from 'react-router-dom';

const ExploreRecipes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    ingredient: '',
    cookingTime: '',
    searchTerm: '',
  });

  useEffect(() => {
    // Parse query string để lấy search term
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (query.search && typeof query.search === 'string') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerm: query.search,
      }));
    }
    console.log('Search:', filters.searchTerm)
  }, [location.search]);

  const [sortBy, setSortBy] = useState('rating')
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái currentPage

  const recipesPerPage = 8;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
  ];

  const handleViewMore = () => {
    setShowAllRecipes(!showAllRecipes);
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true); // Bắt đầu tải dữ liệu
      const response = await axios.get('/api/recipes/search', {
        params: filters,
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType] === value ? '' : value,
    }));
    setCurrentPage(1); // Reset về trang đầu
  };

  const handleSortChange = (value) => {
    setSortBy(value)
  
    if (!recipes || recipes.length === 0) return;
  
    // Sắp xếp danh sách công thức
    const sortedRecipes = [...recipes].sort((a, b) => {
      switch (value) { // Sử dụng giá trị mới
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'rating':
          return b.rating - a.rating;
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  
    setRecipes(sortedRecipes); // Cập nhật danh sách công thức đã sắp xếp
    setCurrentPage(1); // Reset về trang đầu
  };  

  const handleInputChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm: e.target.value,
    }));
  };

  const handleRecipeSelect = (recipe) => {
    navigate(`/recipes/${recipe.id}/information`);
  };

  const displayedRecipes = recipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  return (
    <div className="w-full min-h-screen bg-white">
      <main className="container mx-auto px-6 py-5 flex flex-col md:flex-row gap-6">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
          onInputChange={handleInputChange}
          searchTerm={filters.searchTerm}
          sortOptions={sortOptions}
        />
        <RecipeList
          recipes={displayedRecipes} // Truyền danh sách phân trang
          onRecipeSelect={handleRecipeSelect}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </main>
    </div>
  );
};

export default ExploreRecipes;