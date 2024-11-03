import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginRegisterPage from './pages/Login-Register';



const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage/>} />
        <Route path="/recipes/search" element={<ExploreRecipesPage/>} />
        <Route path="/login" element={<LoginRegisterPage/>} />


        <Route path="/home" element={<HomePage/>} />
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