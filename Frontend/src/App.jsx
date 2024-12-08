import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './pages/HomePage';
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
import RecipeManage from './pages/RecipeManage';
import Profile from './pages/Profile';
import RecipeContestDetail from './pages/RecipeContestDetail';
import RecipeDetail from './pages/Recipes';
import Favourite from './pages/Favourite';
import './styles/styles.css'
import AdminDashboardPage from './pages/AdminDashboard';
import Layout from './components/layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Trang không cần đăng nhập */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/recipes/search" element={<Layout><ExploreRecipesPage /></Layout>} />
        <Route path="/recipes/:id/information" element={<Layout><RecipeDetail /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/competitions">
          <Route path="open" element={<Layout><ExploreCompetitionPage /></Layout>} />
          <Route path="closed" element={<Layout><ExploreCompetitionPage /></Layout>} />
          <Route path="upcoming" element={<Layout><ExploreCompetitionPage /></Layout>} />
          <Route path=":id/information" element={<Layout><CompetitionDetailPage /></Layout>} />
        </Route>

         {/* Trang cần đăng nhập */}
         <Route
          path="/shopping-list"
          element={<ProtectedRoute element={<Layout><ShoppingList /></Layout>} />}
        />
        <Route 
          path="/recipes/create" 
          element={<ProtectedRoute element={<Layout><CreateRecipePage /></Layout>} />} 
        />
        <Route 
          path="/recipes/my-recipes/:id/edit" 
          element={<ProtectedRoute element={<Layout><EditRecipePage /></Layout>} />} 
        />
        <Route
          path="/competitions/:id/submit-entry"
          element={<ProtectedRoute element={<Layout><CreateEntryForCompetitionPage /></Layout>} />}
        />

        {/* Bảo vệ 1 nhóm route */}
        <Route path="/recipes" element={<ProtectedRoute element={<Layout />} />}>
          <Route path="create" element={<Layout><div>Create Page</div></Layout>} />
          <Route path="favourite" element={<Layout><div>Favourite Page</div></Layout>} />
        </Route>

        {/* Bảo vệ 1 nhóm route của admin */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route path="dashboard">
            <Route path="competitions" element={<Layout><AdminDashboardPage /></Layout>} />
            <Route path="users" element={<Layout><AdminDashboardPage /></Layout>} />
            <Route path="recipes" element={<Layout><AdminDashboardPage /></Layout>} />
            <Route path="comments" element={<Layout><AdminDashboardPage /></Layout>} />
            <Route path="competitions" element={<Layout><AdminDashboardPage /></Layout>} />
            <Route path="competitions/:id">
              <Route path="information" element={<Layout><AdminManageACompetitionPage /></Layout>} />
              <Route path="winner" element={<Layout><AdminManageACompetitionPage /></Layout>} />
            </Route>
          </Route>
        </Route>

        <Route path="/recipes/my-recipes" element={<ProtectedRoute element={<Layout><RecipeManage /></Layout>} />} />
        <Route path="/favourite" element={<ProtectedRoute element={<Layout><Favourite /></Layout>} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Layout><Profile /></Layout>} />} />
        <Route path="/trangbaithi" element={<RecipeContestDetail />} />

      </ Routes>

    </Router>
  );
};

export default App