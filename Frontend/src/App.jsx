import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import AdminManageRecipePage from './pages/AdminManageRecipePage'
import HomeRedirect from './components/HomeRedirect';
import CompetitionDetailPage from './pages/CompetitionDetail';
import CreateRecipePage from './pages/CreateRecipePage'
import EditRecipePage from './pages/EditRecipePage'
import CreateEntryForCompetitionPage from './pages/CreateEntryForCompetition'
import ExploreRecipesPage from './pages/ExploreRecipes';
import ExploreCompetitionPage from './pages/ExploreCompetition';
import AdminManageACompetitionPage from './pages/AdminManageACompetitionPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ShoppingList from './pages/ShoppingList';
import AdminManageCommentsPage from './pages/AdminManageCommentsPage';
import AdminDashboardPage from './pages/AdminDashboard';

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
        <Route 
          path="/recipes/create" 
          element={<ProtectedRoute element={<CreateRecipePage />} />} 
        />
        <Route 
          path="/recipes/my-recipes/:id/edit" 
          element={<ProtectedRoute element={<EditRecipePage />} />} 
        />
        <Route
          path="/competitions/:id/submit-entry"
          element={<ProtectedRoute element={<CreateEntryForCompetitionPage />} />}
        />

        {/* Bảo vệ 1 nhóm route */}
        <Route path="/recipes" element={<ProtectedRoute />}>
          <Route path="create" element={(<div>Create Page</div>)} />
          <Route path="favourite" element={(<div>Favourite Page</div>)} />
        </Route>
        
        {/* Bảo vệ 1 nhóm route của admin */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route path="dashboard">
            <Route path="competitions" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminDashboardPage />} />
            <Route path="recipes" element={<AdminDashboardPage />} />
            <Route path="comments" element={<AdminDashboardPage />} />
            <Route path="competitions" element={<AdminDashboardPage />} />
            <Route path="competitions/:id">
              <Route path="information" element={<AdminManageACompetitionPage />} />
              <Route path="winner" element={<AdminManageACompetitionPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App