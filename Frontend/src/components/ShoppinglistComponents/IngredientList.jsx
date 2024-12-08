import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Dùng icon tăng giảm

const IngredientList = ({ ingredients, setIngredients }) => {
  const [editAmount, setEditAmount] = useState('')
  
  const handleIncrease = (id) => {
    // Tạo bản sao của mảng ingredients
    const updatedIngredients = [...ingredients];
    const ingredient = updatedIngredients.find((item) => item.id === id);
    if (ingredient) {
      ingredient.amount = (parseFloat(ingredient.amount) + 0.5).toFixed(2);
      console.log(`Increased: ${ingredient.name}, New Amount: ${ingredient.amount}`);
    }
    // Cập nhật lại state với mảng mới
    setIngredients(updatedIngredients);
  };

  const handleDecrease = (id) => {
    // Tạo bản sao của mảng ingredients
    const updatedIngredients = [...ingredients];
    const ingredient = updatedIngredients.find((item) => item.id === id);
    if (ingredient && parseFloat(ingredient.amount) > 0.5) {
      ingredient.amount = (parseFloat(ingredient.amount) - 0.5).toFixed(2);
      console.log(`Decreased: ${ingredient.name}, New Amount: ${ingredient.amount}`);
    }
    // Cập nhật lại state với mảng mới
    setIngredients(updatedIngredients);
  };

  const handleEdit = (id, newAmount) => {
    const updatedIngredients = ingredients.map((ingredient) => {
      if (ingredient.id === id) {
        return { ...ingredient, amount: newAmount };
      }
      return ingredient;
    });
    setIngredients(updatedIngredients);
  };  

  const handleBlur = (id, oldAmount) => {
    // Khi người dùng rời khỏi input, làm tròn và cập nhật lại ingredients
    const parsedAmount = parseFloat(oldAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const formattedAmount = parsedAmount.toFixed(2); // Làm tròn đến 2 chữ số
      const updatedIngredients = ingredients.map((ingredient) => {
        if (ingredient.id === id) {
          return { ...ingredient, amount: formattedAmount };
        }
        return ingredient;
      });
      setIngredients(updatedIngredients);
    } else {
      // Nếu nhập sai định dạng, khôi phục giá trị cũ
      const updatedIngredients = ingredients.map((ingredient) => {
        if (ingredient.id === id) {
          return { ...ingredient, amount: editAmount }; // Không thay đổi
        }
        return ingredient;
      });
      setIngredients(updatedIngredients);
    }
    setEditAmount('')
  };

  const handleRemove = (id) => {
    const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients(updatedIngredients);
  };

  return (
    <div className="bg-white rounded-xl border border-[#d9d9d9] p-4 min-w-[300px]">
      {/* Table headers */}
      <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 p-4 border-b border-[#e5e8ea]">
        <div className="text-[#141414] text-lg font-bold hidden sm:block">No.</div>
        <div className="col-span-2 text-[#141414] text-lg font-bold place-self-center">
          Item
        </div>
        <div className="col-span-4 text-[#141414] text-lg font-bold place-self-center">
          Amount
        </div>
        <div></div>
      </div>

      {/* Table items */}
      {ingredients.map((ingredient, index) => (
        <div
          key={ingredient.id}
          className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 p-4 border-b border-[#e5e8ea] items-center"
        >
          {/* Số thứ tự */}
          <div className="text-2xl text-[#707070] self-center hidden sm:block">
            {index + 1}
          </div>

          {/* Tên nguyên liệu */}
          <div className="col-span-2 flex items-center gap-2">
            {ingredient.image && (
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-8 h-8 rounded hidden sm:block"
              />
            )}
            <span className="text-[#141414] text-lg whitespace-nowrap">
              {ingredient.name}
            </span>
          </div>

          {/* Số lượng với nút tăng giảm */}
          <div className="col-span-4 sm:pl-6 md:pl-12 lg:px-12 text-[#707070] text-md flex items-center w-full justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDecrease(ingredient.id, ingredient.amount)}
                className="bg-gray-200 px-2 py-1 rounded-full text-lg text-[#141414] hover:bg-gray-300 transition"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={ingredient.amount}
                onChange={(e) => handleEdit(ingredient.id, e.target.value)}
                onBlur={(e) => handleBlur(ingredient.id, e.target.value)}
                onFocus={(e) => setEditAmount(e.target.value)}
                className="w-20 p-1 border rounded text-center"
                step="0.1"
              />
              <span>{ingredient.unit}</span>
            </div>
            <div>
              <button
                onClick={() => handleIncrease(ingredient.id, ingredient.amount)}
                className="bg-gray-200 px-2 py-1 rounded-full text-lg text-[#141414] hover:bg-gray-300 transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Nút Xóa */}
          <div className="flex hidden md:block pl-4">
            <button
              onClick={() => handleRemove(ingredient.id)}
              className="px-4 py-2 bg-red-500 rounded-2xl text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IngredientList; 