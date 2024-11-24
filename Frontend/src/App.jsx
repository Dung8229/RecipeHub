import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Các route chính */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes/search" element={<ExploreRecipesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        
        {/* Các route của competitions */}
        <Route path="/competitions">
          <Route path="open" element={<ExploreCompetitionPage />} />
          <Route path="closed" element={<ExploreCompetitionPage />} />
          <Route path="upcoming" element={<ExploreCompetitionPage />} />
          <Route path=":id/information" element={<CompetitionDetailPage />} />
        </Route>
        
        {/* Các route của admin */}
        <Route path="/admin">
          <Route path="dashboard">
            <Route path="users" element={<AdminManageUsersPage />} />
          </Route>
          <Route path="competitions" element={<AdminManageCompetitionPage />} />
          <Route path="competitions/:id">
            <Route path="information" element={<AdminManageACompetitionPage />} />
            <Route path="winner" element={<AdminManageACompetitionPage />} />
          </Route>
        </Route>

        {/* Quản lý công thức nấu ăn */}
        {/* 
        <Route path="/recipes" element={<ExploreRecipesPage />} />
        <Route path="/recipes/:id/information" element={<RecipeDetailPage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
        <Route path="/recipes/my-recipes/:id/edit" element={<EditRecipePage />} />
        <Route path="/recipes/my-recipes" element={<MyRecipesPage />} />
        <Route path="/recipes/saved" element={<SavedRecipesPage />} />
        */}

        {/* Trang cá nhân người dùng */}
        {/* 
        <Route path="/profile" element={<UserProfilePage />} />
        */}

        {/* Danh sách mua sắm */}
        {/* 
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        */}

        {/* Quản lý cuộc thi */}
        {/* 
        <Route path="/competitions/submit" element={<SubmitCompetitionPage />} />
        */}

        {/* Trang quản trị viên */}
        {/* 
        <Route path="/admin/dashboard/recipes" element={<AdminManageRecipesPage />} />
        <Route path="/admin/dashboard/comments" element={<AdminManageCommentsPage />} />
        <Route path="/admin/competitions" element={<AdminManageCompetitionPage />} />
        */}
      </Routes>
    </Router>
  );
};

export default App