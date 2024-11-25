// File này để design cho từng mục chứa cái Recipe Card
// Chẳng hạn cái HomePage nó có 2 mục là Trending Recipes và Most Popular Recipes
import React from 'react';
import RecipeCard from './RecipeCard';
import { getDinnerRecipes } from '../services/recipes';
import { useEffect, useState } from 'react';

// Mình thêm mẫu chay để test
{/*
const recipes = [
  { title: "Easy BBQ", image: "https://i.pinimg.com/474x/3f/00/87/3f008701749fd1423faacda5c98ad1b2.jpg" },
  { title: "Caribbean Chicken", image: "https://i.pinimg.com/236x/c8/34/5b/c8345b195c23ecc8bfc20fb49df54d0b.jpg" },
  { title: "Broccoli With Horseradish Sauce", image: "https://i.pinimg.com/236x/80/60/6e/80606e6cf3980cd059063d89168a1b9b.jpg" },
  { title: "Mustard Curry Sauce", image: "https://i.pinimg.com/736x/71/4d/25/714d250e4942a18bec95e03914a0db67.jpg" },
  { title: "German-Style Beer Brat Sandwich", image: "https://i.pinimg.com/236x/c9/df/83/c9df831fd48a7f6dc26b10ed43f5a5b2.jpg" },
  { title: "Chicken Wings With BBQ Sauce for the Crock Pot!", image: "https://i.pinimg.com/236x/00/2e/05/002e057c06c9af00d7d75cd101448e36.jpg" },
  { title: "Honey Mustard Meatloaf", image: "https://i.pinimg.com/236x/e8/d0/02/e8d002696e5c7b00be0d59dbc19d9eab.jpg" },
  { title: "Egg and Ham Salad", image: "https://i.pinimg.com/236x/3b/8a/eb/3b8aebda87d50eb5e9181c75bc02626a.jpg" },
];
*/}


const RecipeSection = ({ title }) => {

  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ api theo dinner recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getDinnerRecipes();
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="my-12 px-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeSection;

