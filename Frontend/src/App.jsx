import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeManage from './pages/RecipeManage';
import Header from './pages/Header';
import Profile from './pages/Profile';
import RecipeContestDetail from './pages/RecipeContestDetail';
import RecipeDetail from './pages/RecipeDetail';
import './styles/styles.css'
const recipes = [
  {
    "id": 715415,
    "title": "Red Lentil Soup with Chicken and Turnips",
    "image": "https://img.spoonacular.com/recipes/715415-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 716406,
    "title": "Asparagus and Pea Soup: Real Convenience Food",
    "image": "https://img.spoonacular.com/recipes/716406-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 644387,
    "title": "Garlicky Kale",
    "image": "https://img.spoonacular.com/recipes/644387-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 715446,
    "title": "Slow Cooker Beef Stew",
    "image": "https://img.spoonacular.com/recipes/715446-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 782601,
    "title": "Red Kidney Bean Jambalaya",
    "image": "https://img.spoonacular.com/recipes/782601-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 716426,
    "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
    "image": "https://img.spoonacular.com/recipes/716426-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 716004,
    "title": "Quinoa and Chickpea Salad with Sun-Dried Tomatoes and Dried Cherries",
    "image": "https://img.spoonacular.com/recipes/716004-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 716627,
    "title": "Easy Homemade Rice and Beans",
    "image": "https://img.spoonacular.com/recipes/716627-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 664147,
    "title": "Tuscan White Bean Soup with Olive Oil and Rosemary",
    "image": "https://img.spoonacular.com/recipes/664147-312x231.jpg",
    "imageType": "jpg"
  },
  {
    "id": 640941,
    "title": "Crunchy Brussels Sprouts Side Dish",
    "image": "https://img.spoonacular.com/recipes/640941-312x231.jpg",
    "imageType": "jpg"
  }
]

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho trang chủ */}
        <Route path="/" element={<HomePage recipes={recipes} user={latestUser} />} />

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
        {/* <Route path="/recipes/:id/information" element={<RecipeInformation />} /> */}
        <Route path="/manage" element={<RecipeManage />} />
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
}

export default App