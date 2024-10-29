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
        <Route path="/api/home" element={<HomePage/>} />
        {/* <Route path="/api/register" element={<RegisterPage />} />
        <Route path="/api/login" element={<LoginPage />} />
        <Route path="/api/recipes" element={<ExploreRecipesPage />} />
/api/recipes/:id/information
/api/profile
/api/recipes/create
/api/recipes/my-recipes/:id/edit
/api/recipes/my-recipes
/api/recipes/saved
/api/shopping-list
/api/competitions/:id/information
/api/competitions/submit
/api/admin/dashboard/recipes
/api/admin/dashboard/comments
/api/admin/competitions */}
        <Route path="/api/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/api/competitions/closed" element={<ExploreCompetitionPage/>} />
        <Route path="/api/admin/dashboard/user" element={<AdminManageUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App