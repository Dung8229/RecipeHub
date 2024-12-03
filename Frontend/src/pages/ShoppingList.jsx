import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import IngredientList from '../components/ShoppinglistComponents/IngredientList';
import RecipeList from '../components/ShoppinglistComponents/RecipeList';
import SearchBar from '../components/ShoppinglistComponents/SearchBar';
import shoppinglistService from '../services/shoppinglists';
import { jsPDF } from "jspdf";
// import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ShoppingList = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isDirty, setIsDirty] = useState(false); // Theo dõi nếu có thay đổi chưa lưu
  const [originalRecipes, setOriginalRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesData = await shoppinglistService.getRecipes()
        // Tạo danh sách servingsData từ recipesData
        const servingsData = recipesData.map(recipe => ({
          recipeId: recipe.id, // Đảm bảo sử dụng đúng key
          servings: recipe.servings
        }));
        const ingredientsData = await shoppinglistService.getIngredients(servingsData)
  
        setRecipes(recipesData);
        setOriginalRecipes(recipesData)
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
  }

  const handleRemoveAllRecipes = async () => {
    const userConfirmed = window.confirm('Are you sure you want to remove ALL recipes from your shopping list? This action can not be undone');

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await shoppinglistService.removeAllRecipes(); // Gọi service xóa công thức
      console.log('Recipes removed:', response); // Log kết quả trả về nếu cần

      setRecipes([])
      setIngredients([]);
    } catch (error) {
      console.error('Failed to remove recipe:', error); // Log lỗi
      alert('Failed to remove recipe. Please try again.'); // Hiển thị thông báo lỗi nếu cần
    }
  }

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleReset = async () => {
    try {
      const recipesData = await shoppinglistService.getRecipes()
      // Tạo danh sách servingsData từ recipesData
      const servingsData = recipesData.map(recipe => ({
        recipeId: recipe.id, // Đảm bảo sử dụng đúng key
        servings: recipe.servings
      }));
      const ingredientsData = await shoppinglistService.getIngredients(servingsData)

      setRecipes(recipesData);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error fetching shopping list recipes or ingredients:', error);
    }
  }

  // Hàm handleServingsChange
  const handleServingsChange = async (recipeId, newServings) => {
    try {
      // Cập nhật số phần ăn trong danh sách recipes
      const updatedRecipes = recipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, servings: newServings } : recipe
      );

      // Cập nhật state recipes
      setRecipes(updatedRecipes);
      setIsDirty(true)
    } catch (error) {
      console.error('Error updating servings or fetching ingredients:', error);
    }
  };

  const handleSaveChanges = async () => {
    const userConfirmed = window.confirm(
      "Saving changes will discard your ingredient list changes. Do you want to proceed?"
    );
  
    if (!userConfirmed) {
      // Reset lại recipes về trạng thái gốc
      setRecipes([...originalRecipes]); 
      setIsDirty(false); // Xóa trạng thái thay đổi
      return;
    }
  
    try {
      // Tạo servingsData từ recipes
      const servingsData = recipes.map((recipe) => ({
        recipeId: recipe.id,
        servings: recipe.servings,
      }));
  
      // Gọi API để lấy danh sách nguyên liệu mới
      const updatedIngredients = await shoppinglistService.getIngredients(servingsData);
  
      // Cập nhật state
      setIngredients(updatedIngredients);
      setOriginalRecipes([...recipes])
      setIsDirty(false); // Đặt lại trạng thái thay đổi
    } catch (error) {
      console.error("Error saving changes or fetching ingredients:", error);
    }
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const primaryColor = "#FFA726"; // Màu chủ đạo
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");
  
    // Ngày tạo file (góc trên bên phải)
    doc.setFontSize(10);
    doc.setTextColor("black");
    doc.text(`Generated on: ${formattedDate}`, 190, 10, { align: "right" });
  
    // Tiêu đề chính: Shopping List (Căn giữa)
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    const titleWidth = doc.getTextWidth("Shopping List");
    doc.text("Shopping List", 105 - titleWidth / 2, 20); // Căn giữa với việc tính toán độ dài của tiêu đề
  
    // Tiêu đề phụ: Recipes (Căn giữa)
    doc.setFontSize(18);
    const recipesWidth = doc.getTextWidth("Recipes");
    doc.text("Recipes", 105 - recipesWidth / 2, 35); // Căn giữa với việc tính toán độ dài của tiêu đề
  
    // Vẽ dòng kẻ ngang dưới tiêu đề "Recipes"
    const recipeY = 37;
    doc.setLineWidth(0.5);
    doc.line(10, recipeY, 200, recipeY); // Vẽ từ trái sang phải
  
    // Thêm danh sách công thức
    let currentY = 45; // Vị trí Y hiện tại
    recipes.forEach((recipe, recipeIndex) => {
      if (currentY >= 270) { // Kiểm tra nếu vị trí Y gần dưới đáy trang
        doc.addPage(); // Thêm trang mới nếu cần
        currentY = 10; // Bắt đầu lại từ vị trí trên cùng trang mới
      }
      doc.setFontSize(12);
      doc.setTextColor("black");
      doc.text(
        `${recipeIndex + 1}. ${recipe.title} (Servings: ${recipe.servings})`,
        10,
        currentY
      );
      currentY += 8; // Di chuyển xuống mỗi dòng
    });
  
    // Thêm khoảng cách giữa Recipes và Ingredients
    currentY += 10;
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    const ingredientsWidth = doc.getTextWidth("Ingredients");
    doc.text("Ingredients", 105 - ingredientsWidth / 2, currentY); // Căn giữa với việc tính toán độ dài của tiêu đề
  
    // Vẽ dòng kẻ ngang dưới tiêu đề "Ingredients"
    const ingredientY = currentY + 2;
    doc.line(10, ingredientY, 200, ingredientY); // Vẽ từ trái sang phải
  
    // Thêm danh sách nguyên liệu
    currentY = ingredientY + 10;
    ingredients.forEach((ingredient, index) => {
      if (currentY >= 270) { // Kiểm tra nếu vị trí Y gần dưới đáy trang
        doc.addPage(); // Thêm trang mới nếu cần
        currentY = 10; // Bắt đầu lại từ vị trí trên cùng trang mới
      }
      doc.setFontSize(12);
      doc.setTextColor("black");
      doc.text(
        `${index + 1}. ${ingredient.name} - ${ingredient.amount} ${ingredient.unit}`,
        10,
        currentY
      );
      currentY += 8; // Di chuyển xuống mỗi nguyên liệu
    });
  
    // Tên file PDF với ngày tháng
    const fileName = `Shopping-List-${formattedDate.replace(/\//g, "-")}.pdf`;
  
    // Lưu file PDF
    doc.save(fileName);
  };
   

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-[170px] bg-white">
        <div className="w-full h-[106px] flex justify-center items-center gap-20">
          <div className="text-[#ff8c00] text-8xl font-handwriting font-bold font-['Qwitcher Grypen']">
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

      <main className="flex flex-col-reverse xl:flex-row px-6 py-5 gap-4 bg-neutral-100">
        {/* Shopping List Section */}
        <div className="flex-1 xl:w-2/3 w-full">
          <div className="flex justify-between items-center p-4">
            <h1 className="w-full text-[#707070] text-[48px] text-center font-handwriting font-bold">
              My shopping lists
            </h1>
            <button
              onClick={handleExportPdf}
              className="text-[#FFA726] text-3xl rounded-full hover:text-primaryHover transition-colors"
              aria-label="Download PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
          </div>

          {/* Shopping List Table */}
          <IngredientList
            ingredients={ingredients}
            setIngredients={setIngredients}
          />

          {/* Action Buttons */}
          <div className="flex items-baseline justify-evenly">
            <div className="w-full max-w-md items-center">
              <SearchBar onAddIngredient={handleAddIngredient} ingredients={ingredients}/>
            </div>
            <button
              onClick={handleExportPdf}
              className="py-2 px-6 max-w-md bg-[#ff8c00] rounded-3xl text-white font-bold hover:bg-[#e67e00] transition-colors"
            >
              Export to PDF
            </button>
            <button 
              className="py-2 px-6 max-w-md bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold hover:bg-[#d8d8d8] transition-colors"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Selected Recipes Section */}
        <div className="xl:w-1/3 w-full xl:sticky top-5 h-[calc(100vh-2rem)] overflow-y-auto">
          <RecipeList 
            recipes={recipes} 
            handleRemoveRecipe={handleRemoveRecipe}
            handleRemoveAllRecipes={handleRemoveAllRecipes}
            handleServingsChange={handleServingsChange}
            isDirty={isDirty}
            handleSaveChanges={handleSaveChanges}
          />
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