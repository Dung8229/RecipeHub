import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginRegisterPage from './pages/Login-Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/recipes/search" element={<ExploreRecipesPage/>} />
        <Route path="/login" element={<LoginRegisterPage/>} />
      </Routes>
    </Router>
  );
}

export default App