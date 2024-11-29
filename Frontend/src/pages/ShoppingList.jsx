import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import IngredientList from '../components/ShoppinglistComponents/IngredientList';
import RecipeList from '../components/ShoppinglistComponents/RecipeList';
import SearchBar from '../components/ShoppinglistComponents/SearchBar';
import shoppinglistService from '../services/shoppinglists';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShoppingList = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, ingredientsData] = await Promise.all([
          shoppinglistService.getRecipes(),
          shoppinglistService.getIngredients()
        ]);
  
        setRecipes(recipesData);
        setIngredients(ingredientsData);
      } catch (error) {
        console.error('Error fetching shopping list recipes or ingredients:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleRemoveRecipe = async (recipeId) => {
    const userConfirmed = window.confirm('Are you sure you want to remove this recipe from your shopping list? All the changes made on the shopping list will be discarded');

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await shoppinglistService.removeRecipe(recipeId); // Gọi service xóa công thức
      console.log('Recipe removed:', response); // Log kết quả trả về nếu cần

      const ingredientsData = await shoppinglistService.getIngredients()
      setIngredients(ingredientsData);

      setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Failed to remove recipe:', error); // Log lỗi
      alert('Failed to remove recipe. Please try again.'); // Hiển thị thông báo lỗi nếu cần
    }
  };

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleReset = async () => {
    try {
      // Gọi cả hai API đồng thời
      const [recipesData, ingredientsData] = await Promise.all([
        shoppinglistService.getRecipes(),
        shoppinglistService.getIngredients()
      ]);

      // Cập nhật state sau khi cả hai API trả về dữ liệu
      setRecipes(recipesData);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error fetching shopping list recipes or ingredients:', error);
    }
  }

  const handleExportPDF = () => {
    // const doc = new jsPDF();

    // doc.text('Shopping List', 14, 20);
    // const tableColumn = ["Item", "Quantity"];
    // const tableRows = [];

    // ingredients.forEach(ingredient => {
    //   const ingredientData = [
    //     ingredient.name,
    //     `${ingredient.quantity} ${ingredient.unit}`
    //   ];
    //   tableRows.push(ingredientData);
    // });

    // doc.autoTable(tableColumn, tableRows, { startY: 30 });
    // doc.save('shopping_list.pdf');
  };

  return (
    <div className="w-full min-h-screen bg-white">
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

      <main className="flex flex-col xl:flex-row px-6 py-5 gap-4 bg-neutral-100">
        {/* Shopping List Section */}
        <div className="flex-1 xl:w-2/3 w-full">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-[#707070] text-[32px] font-medium font-['Poppins']">
              Shopping lists
            </h1>
            <img className="w-[50px] h-[50px]" src="/pdf-icon.png" alt="PDF" />
          </div>

          {/* Shopping List Table */}
          <IngredientList
            ingredients={ingredients}
            setIngredients={setIngredients}
          />

          {/* Action Buttons */}
          <div className="mt-6 space-y-4 flex flex-col items-center">
            <div className="w-full max-w-md">
              <SearchBar onAddIngredient={handleAddIngredient} />
            </div>
            <button
              onClick={handleExportPDF}
              className="h-12 px-6 max-w-md bg-[#ff8c00] rounded-3xl text-white font-bold hover:bg-[#e67e00] transition-colors"
            >
              Export to PDF
            </button>
            <button 
              className="h-12 px-6 max-w-md bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold hover:bg-[#d8d8d8] transition-colors"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Selected Recipes Section */}
        <div className="xl:w-1/3 w-full sticky top-5 h-[calc(100vh-2rem)] overflow-y-auto">
          <RecipeList recipes={recipes} handleRemove={handleRemoveRecipe} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full h-[338px] bg-white">
        {/* ... (Phần Footer giữ nguyên như trước) */}
      </footer>
    </div>
  );
};

export default ShoppingList; 