import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginRegisterPage from './pages/Login-Register';
import ExploreCompetitionPage from './pages/ExploreCompetition';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/recipes/search" element={<ExploreRecipesPage/>} />
        <Route path="/login" element={<LoginRegisterPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/admin/dashboard/users" element={<AdminManageUsersPage/>} />
        <Route path="/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/closed" element={<ExploreCompetitionPage/>} />
      </Routes>
    </Router>
  );
}

export default App