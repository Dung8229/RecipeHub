import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import ingredientService from '../../services/ingredient';

const UNIT = [
  'g', 'kg', 'mg', 'lb', 'lbs', 'ounce', 'ounces', 'oz', 
  'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 
  'teaspoon', 'teaspoons', 'small', 'medium', 'large', 'clove', 
  'cloves', 'pint', 'piece', 'pieces',
];

const SearchBar = ({ onAddIngredient, ingredients }) => {
  const [query, setQuery] = useState(''); // Dữ liệu người dùng nhập
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
  const [selectedIngredient, setSelectedIngredient] = useState(null); // Nguyên liệu đã chọn
  const [unit, setUnit] = useState(''); // Đơn vị

  // Gọi API tìm kiếm khi `query` thay đổi
  useEffect(() => {
    if (query.trim()) {
      const fetchIngredients = async () => {
        try {
          const response = await ingredientService.search(query);
          const filteredResults = response.filter(
            (ingredient) => !ingredients.some((item) => item.id === ingredient.id)
          );
          
          if (filteredResults.length === 0 || (filteredResults.length === 1 && filteredResults[0].name === query)) {
            setSearchResults([]);
          } else {
            setSearchResults(filteredResults);
          }
        } catch (error) {
          console.error('Error searching ingredients:', error);
        }
      };
      fetchIngredients();
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // Khi chọn một nguyên liệu
  const handleSelectIngredient = (ingredient) => {
    ingredient.image = 'https://img.spoonacular.com/ingredients_100x100/' + ingredient.image
    ingredient.amount = 1.00
    setSelectedIngredient(ingredient); // Lưu nguyên liệu được chọn
    setQuery(ingredient.name)
    setSearchResults([]); // Ẩn danh sách tìm kiếm
  };

  // Thêm nguyên liệu vào danh sách thông qua `onAddIngredient`
  const handleAddIngredient = () => {
    if (!selectedIngredient || !unit) return; // Kiểm tra thông tin đầy đủ

    onAddIngredient({ ...selectedIngredient, unit }); // Gọi hàm thêm nguyên liệu
    setSelectedIngredient(null); // Reset nguyên liệu được chọn
    setUnit(''); // Reset đơn vị
    setQuery('')
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Search for an ingredient"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
      {searchResults.length > 0 && (
        <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto">
          {searchResults.map((ingredient) => (
            <li
              key={ingredient.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectIngredient(ingredient)}
            >
              {ingredient.name}
            </li>
          ))}
        </ul>
      )}

      {/* Hiển thị thông tin nguyên liệu đã chọn */}
      {selectedIngredient && (
        <div className="mt-4">
          <h4>Selected Ingredient: {selectedIngredient.name}</h4>
          {/* Form chọn đơn vị */}
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          >
            <option value="" disabled>Select Unit</option>
            <option key="none" value=" ">(none)</option>
            {UNIT.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddIngredient}
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Add Ingredient
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;