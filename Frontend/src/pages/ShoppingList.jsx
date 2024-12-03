import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import IngredientList from '../components/ShoppinglistComponents/IngredientList';
import RecipeList from '../components/ShoppinglistComponents/RecipeList';
import SearchBar from '../components/ShoppinglistComponents/SearchBar';
import { 
  addRecipeToShoppingList, 
  removeRecipeFromShoppingList, 
  getShoppingListRecipes, 
  getIngredientsFromRecipes 
} from '../services/shoppinglists';
import {jsPDF} from 'jspdf';
// import 'jspdf-autotable';

const ShoppingList = () => {
  const location = useLocation();
  const userID = 'user123'; // Thay thế bằng cách lấy userID thực tế
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // Lấy danh sách công thức từ API
    getShoppingListRecipes(userID)
      .then(response => {
        setRecipes(response.data.recipes || []);
        const recipeIDs = response.data.recipes.map(recipe => recipe.id);
        // Tính toán danh sách nguyên liệu từ các công thức
        return getIngredientsFromRecipes(recipeIDs);
      })
      .then(response => {
        setIngredients(response.data.ingredients);
      })
      .catch(error => {
        console.error('Error fetching shopping list:', error);
      });
  }, [userID]);

  useEffect(() => {
    // Kiểm tra nếu có công thức mới được thêm vào
    if (location.state?.addedRecipe) {
      const newRecipe = location.state.addedRecipe;
      setRecipes(prev => [...prev, newRecipe]);
      
      // Cập nhật danh sách nguyên liệu
      getIngredientsFromRecipes([...recipes.map(r => r.id), newRecipe.id])
        .then(response => {
          setIngredients(response.data.ingredients);
        })
        .catch(error => {
          console.error('Error updating ingredients:', error);
        });
    }
  }, [location.state]);

  const handleRemoveRecipe = (recipeID) => {
    removeRecipeFromShoppingList(userID, recipeID)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeID));
        const updatedRecipeIDs = recipes
          .filter(recipe => recipe.id !== recipeID)
          .map(recipe => recipe.id);
        return getIngredientsFromRecipes(updatedRecipeIDs);
      })
      .then(response => {
        setIngredients(response.data.ingredients);
      })
      .catch(error => {
        console.error('Error removing recipe:', error);
      });
  };

  const handleEditIngredient = (ingredientID, newQuantity) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === ingredientID ? { ...ingredient, quantity: newQuantity } : ingredient
    ));
    // Bạn có thể thực hiện cập nhật lên backend nếu cần
  };

  const handleRemoveIngredient = (ingredientID) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== ingredientID));
    // Bạn có thể thực hiện cập nhật lên backend nếu cần
  };

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
    // Bạn có thể thực hiện cập nhật lên backend nếu cần
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text('Shopping List', 14, 20);
    const tableColumn = ["Item", "Quantity"];
    const tableRows = [];

    ingredients.forEach(ingredient => {
      const ingredientData = [
        ingredient.name,
        `${ingredient.quantity} ${ingredient.unit}`
      ];
      tableRows.push(ingredientData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save('shopping_list.pdf');
  };

  return (
    <div className="w-[1440px] min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-[170px] bg-white">
        <div className="w-full h-[106px] flex justify-center items-center gap-20">
          <div className="text-[#ff8c00] text-8xl font-bold font-['Qwitcher Grypen']">
            Recipehub
          </div>
          
          <div className="relative w-[603px] h-[58px]">
            <input 
              type="text"
              placeholder="Find a recipe or ingredient"
              className="w-full h-full px-4 rounded-[10px] border border-black"
            />
            <button className="absolute right-0 w-[58px] h-full bg-[#ff8c00] rounded-tr-[10px] rounded-br-[10px] border border-black">
              {/* Search icon */}
            </button>
          </div>

          <div className="flex items-center gap-[15px]">
            <img className="w-[58px] h-[58px]" src="/login-icon.png" alt="Login" />
            <span className="text-black text-xl font-medium font-['Poppins']">LOG IN</span>
          </div>
        </div>

        <nav className="h-16 flex justify-center items-center gap-[110px]">
          {['HOME', 'DINNER', 'VEGETARIAN', 'CONTESTS', 'SHOPPING LIST', 'CONTACT'].map(item => (
            <a key={item} className="text-black text-xl font-medium font-['Poppins']">{item}</a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex px-6 py-5 gap-4 bg-neutral-100">
        {/* Shopping List Section */}
        <div className="w-[912px]">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-[#707070] text-[32px] font-medium font-['Poppins']">
              Shopping lists
            </h1>
            <img className="w-[50px] h-[50px]" src="/pdf-icon.png" alt="PDF" />
          </div>

          {/* Shopping List Table */}
          <IngredientList 
            ingredients={ingredients} 
            onEdit={handleEditIngredient} 
            onRemove={handleRemoveIngredient} 
          />

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            {/* Thêm Nguyên Liệu */}
            <div>
              <SearchBar onAddIngredient={handleAddIngredient} />
            </div>
            <button 
              onClick={handleExportPDF}
              className="w-[480px] h-12 bg-[#ff8c00] rounded-3xl text-white font-bold"
            >
              Export to PDF
            </button>
            <button className="w-[480px] h-12 bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold">
              Reset
            </button>
          </div>
        </div>

        {/* Selected Recipes Section */}
        <RecipeList 
          recipes={recipes} 
          onRemove={handleRemoveRecipe} 
        />
      </main>

      {/* Footer */}
      <footer className="w-full h-[338px] bg-white">
        {/* ... (Phần Footer giữ nguyên như trước) */}
      </footer>
    </div>
  );
};

export default ShoppingList; 