import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ShoppingList from './pages/ShoppingList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/recipes/search" element={<ExploreRecipesPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/shopping-list" element={<ShoppingList/>} />
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<ExploreRecipesPage />} />
        /recipes/:id/information
        /profile
        /recipes/create
        /recipes/my-recipes/:id/edit
        /recipes/my-recipes
        /recipes/saved
        /shopping-list
        /competitions/:id/information
        /competitions/submit
        /admin/dashboard/recipes
        /admin/dashboard/comments
        /admin/competitions */}
      </Routes>
    </Router>
  );
}

export default App