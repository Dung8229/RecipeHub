import React, { useState, useEffect } from 'react';
import Header from '../components/ExploreRecipeComponents/Header';
import Sidebar from '../components/ExploreRecipeComponents/Sidebar';
import RecipeList from '../components/ExploreRecipeComponents/RecipeList';
import axios from 'axios';

const ExploreRecipes = () => {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    ingredient: '',
    cookingTime: '',
    difficulty: '',
    searchTerm: ''
  });

  const handleViewMore = () => {
    setShowAllRecipes(!showAllRecipes);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/recipes/search', { 
        params: { 
          searchTerm: filters.searchTerm, 
          category: filters.category,
          ingredient: filters.ingredient,
          cookingTime: filters.cookingTime,
          difficulty: filters.difficulty
        } 
      });
      setRecipes(response.data); // Cập nhật danh sách món ăn
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleInputChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchTerm: e.target.value
    }));
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-5 flex">
        <Sidebar 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch} 
          onInputChange={handleInputChange} 
          searchTerm={filters.searchTerm} // Truyền searchTerm vào Sidebar
        />
        <RecipeList recipes={recipes} showAllRecipes={showAllRecipes} onViewMore={handleViewMore} />
      </main>
    </div>
  );
};

export default ExploreRecipes;
