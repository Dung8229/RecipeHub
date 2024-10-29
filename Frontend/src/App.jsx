import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExploreCompetitionPage from './pages/ExploreCompetition';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import HomeRedirect from './components/HomeRedirect';
// import RegisterPage from './pages/Register'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
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
        <Route path="/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/closed" element={<ExploreCompetitionPage/>} />
        <Route path="/admin/dashboard/user" element={<AdminManageUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App