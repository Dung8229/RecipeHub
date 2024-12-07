import React, { useState, useEffect } from 'react';
import Header from '../components/ExploreRecipeComponents/Header';
import Sidebar from '../components/ExploreRecipeComponents/Sidebar';
import RecipeList from '../components/ExploreRecipeComponents/RecipeList';
import axios from 'axios';
// import { addRecipeToShoppingList } from '../services/shoppinglists';
import { useLocation, useNavigate } from 'react-router-dom';

const ExploreRecipes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFromShoppingList = location.state?.fromShoppingList;

  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    ingredient: '',
    cookingTime: '',
    searchTerm: '',
    sortBy: 'newest'
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' }
  ];

  const handleViewMore = () => {
    setShowAllRecipes(!showAllRecipes);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/recipes/search', { 
        params: filters
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType] === value ? '' : value
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      sortBy: value
    }));
  };

  const handleInputChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchTerm: e.target.value
    }));
  };

  const handleRecipeSelect = (recipe) => {
    navigate(`/recipes/${recipe.id}/information`);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
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
          recipes={recipes} 
          showAllRecipes={showAllRecipes} 
          onViewMore={handleViewMore} 
          onRecipeSelect={handleRecipeSelect}
        />
      </main>
    </div>
  );
};

export default ExploreRecipes;
