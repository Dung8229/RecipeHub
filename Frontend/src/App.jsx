import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import HomeRedirect from './components/HomeRedirect';
import CompetitionDetailPage from './pages/CompetitionDetail';
import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginRegisterPage from './pages/Login-Register';
import ExploreCompetitionPage from './pages/ExploreCompetition';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/recipes/search" element={<ExploreRecipesPage/>} />
        <Route path="/login" element={<LoginRegisterPage/>} />
        <Route path="/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/closed" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/:id/information" element={<CompetitionDetailPage />} />
        <Route path="/admin/dashboard/users" element={<AdminManageUsersPage/>} />
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
        /competitions/submit
        /admin/dashboard/recipes
        /admin/dashboard/comments
        /admin/competitions */}
      </Routes>
    </Router>
  );
}

export default App