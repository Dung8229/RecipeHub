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
import RecipeManage from './pages/RecipeManage';
import Header from './pages/Header';
import Profile from './pages/Profile';
import RecipeContestDetail from './pages/RecipeContestDetail';
import RecipeDetail from './pages/Recipes';
import Favourite from './pages/Favourite';
import './styles/styles.css'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho trang chủ */}
        <Route path="/" element={<HomePage recipes={recipes} />} />
        {/* user={latestUser}  */}
        {/* Route cho trang login */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Route cho trang chi tiết công thức */}
        <Route path="/trangcongthuc" element={
          <>
            <Header />
            <RecipeDetail />
          </>
        }
        />
        {/* <Route path="/recipes/favourite" element={<Favourite />} /> */}

        <Route path="/recipes/:id/information" element={<RecipeDetail />} />
        <Route path="/manage" element={<RecipeManage />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/myprofile" element={
          <>
            <Header />
            <Profile />

          </>
        }
        />
        <Route path="/trangbaithi" element={<RecipeContestDetail />} />

      </ Routes>

    </Router>
  );
};

export default App