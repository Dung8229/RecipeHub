import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExploreCompetitionPage from './pages/ExploreCompetition';
import AdminManageUsersPage from './pages/AdminManageUsersPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/closed" element={<ExploreCompetitionPage/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/admin/dashboard" element={<AdminManageUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App