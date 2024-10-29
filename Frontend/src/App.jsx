import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExploreRecipes from './pages/ExploreRecipes'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api/recipes" element={<ExploreRecipes />} />
      </Routes>
    </Router>
  );
}

export default App