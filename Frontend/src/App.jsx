import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import HomeRedirect from './components/HomeRedirect';
import CompetitionDetailPage from './pages/CompetitionDetail';
import ExploreRecipesPage from './pages/ExploreRecipes';
import ExploreCompetitionPage from './pages/ExploreCompetition';
import AdminManageCompetitionPage from './pages/AdminManageCompetitionPage';
import AdminManageACompetitionPage from './pages/AdminManageACompetitionPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ShoppingList from './pages/ShoppingList';
import AdminManageCommentsPage from './pages/AdminManageCommentsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Trang không cần đăng nhập */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes/search" element={<ExploreRecipesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/comments" element={<AdminManageCommentsPage />} />
        
        <Route path="/competitions">
          <Route path="open" element={<ExploreCompetitionPage />} />
          <Route path="closed" element={<ExploreCompetitionPage />} />
          <Route path="upcoming" element={<ExploreCompetitionPage />} />
          <Route path=":id/information" element={<CompetitionDetailPage />} />
        </Route>

         {/* Trang cần đăng nhập */}
         {/* Bảo vệ 1 route */}
        <Route
          path="/shopping-list"
          element={<ProtectedRoute element={<ShoppingList />} />}
        />

        {/* Bảo vệ 1 nhóm route */}
        <Route path="/recipes" element={<ProtectedRoute />}>
          <Route path="create" element={(<div>Create Page</div>)} />
          <Route path="favourite" element={(<div>Favourite Page</div>)} />
        </Route>
        
        {/* Bảo vệ 1 nhóm route của admin */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route path="dashboard">
            <Route path="users" element={<AdminManageUsersPage />} />
          </Route>
            <Route path="competitions" element={<AdminManageCompetitionPage />} />
            <Route path="competitions/:id">
              <Route path="information" element={<AdminManageACompetitionPage />} />
              <Route path="winner" element={<AdminManageACompetitionPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App