import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import HomeRedirect from './components/HomeRedirect';
import CompetitionDetailPage from './pages/CompetitionDetail';
import ExploreRecipesPage from './pages/ExploreRecipes';
import LoginRegisterPage from './pages/Login-Register';
import ExploreCompetitionPage from './pages/ExploreCompetition';
import AdminManageCompetitionPage from './pages/AdminManageCompetitionPage';
import AdminManageACompetitionPage from './pages/AdminManageACompetitionPage';
import CreateRecipePage from './pages/CreateRecipePage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Các route chính */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes/search" element={<ExploreRecipesPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        
        {/* Các route của competitions */}
        <Route path="/competitions">
          <Route path="open" element={<ExploreCompetitionPage />} />
          <Route path="closed" element={<ExploreCompetitionPage />} />
          <Route path="upcoming" element={<ExploreCompetitionPage />} />
          <Route path=":id/information" element={<CompetitionDetailPage />} />
        </Route>
        
        {/* Các route của admin */}
        <Route path="/admin">
          <Route path="dashboard/users" element={<AdminManageUsersPage />} />
          <Route path="competitions" element={<AdminManageCompetitionPage />} />
          <Route path="competitions/:id/information" element={<AdminManageACompetitionPage />} />
          <Route path=":id/winner" element={<AdminManageACompetitionPage />} />
        </Route>

        {/* Các route bổ sung được nhóm theo module (comment) */}
        
        {/* Xác thực người dùng */}
        {/* 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        */}

        <Route path="/recipes/create" element={<CreateRecipePage />} />
        <Route path="/recipes/my-recipes/:id/edit" element={<EditRecipePage />} />
        {/* Quản lý công thức nấu ăn */}
        {/* 
        <Route path="/recipes" element={<ExploreRecipesPage />} />
        <Route path="/recipes/:id/information" element={<RecipeDetailPage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
        
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