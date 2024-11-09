import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { getIngredients, validateImageUrl, createRecipe } from '../services/recipes';

const Create = () => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // URL tạm thời hiển thị ảnh để xem trước khi Upload

  const [ingredients, setIngredients] = useState([]);
  const [description, setDescription] = useState('');

  // Tải danh sách nguyên liệu lên
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredients();
        setIngredients(data); // Cập nhật state ingredients với dữ liệu từ API
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
      }
    };
  
    fetchIngredients();
  }, []);
  
  // State lưu checkbox nào được chọn: 'URLInput' hoặc 'PhotoFileInput'
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  // Kiểm tra URL ảnh người dùng nhập có hợp lệ không
  const handleUrlSubmit = async () => {
    const url = document.getElementById("url-input").value;
    try {
      const isValid = await validateImageUrl(url);
      if (isValid) {
        setPreviewImage(url); // Hiển thị ảnh xem trước nếu URL hợp lệ
        console.log("URL hợp lệ:", url);
      } else {
        alert("URL ảnh không hợp lệ");
      }
    } catch (error) {
      console.error("Error validating image URL:", error);
    }
  };

  // Xử lý khi chọn tệp ảnh (này là cái nút chọn tệp á)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file)); // Tạo URL tạm thời để hiển thị ảnh
  };

  // Upload ảnh
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Image uploaded:', res.data);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  // Thêm logic cho phần nguyên liệu
  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Sử dụng hàm createRecipe để gửi dữ liệu công thức lên server khi người dùng nhấn nút Submit
  const handleSubmitRecipe = async () => {
    const recipeData = {
      title: 'Tên công thức của bạn', // Thay đổi với tên công thức từ input
      description,
      ingredients,
      image: previewImage || null, // Sử dụng previewImage nếu có
      // Các trường khác như servings, readyInMinutes, difficulty...
    };
  
    try {
      const response = await createRecipe(recipeData);
      console.log("Recipe created:", response);
      alert("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-32">
        <div className="p-8 bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">Create a Recipe</h1>
          <label className="block text-gray-700">Recipe Image</label>

          <div className="flex space-x-4 mb-4 mt-4">
            {/* Checkbox đầu tiên để hiển thị URL */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedCheckbox === 'URLInput'}
                onChange={() =>
                  setSelectedCheckbox(selectedCheckbox === 'URLInput' ? null : 'URLInput')
                }
              />
              <span>URL</span>
            </label>

            {/* Checkbox thứ hai để hiển thị upload ảnh */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedCheckbox === 'PhotoFileInput'}
                onChange={() =>
                  setSelectedCheckbox(selectedCheckbox === 'PhotoFileInput' ? null : 'PhotoFileInput')
                }
              />
              <span>Upload Photo</span>
            </label>
          </div>

          {/* Hiển thị input URL và nút submit*/}
          {selectedCheckbox === 'URLInput' && (
            <div className="mb-4 p-2 border border-gray-300 rounded">
              <input
                type="url"
                placeholder="Nhập URL..."
                className="border border-gray-300 rounded p-2 mr-2"
                id="url-input" // Thêm id để dễ dàng lấy giá trị
              />
              <button
                className="bg-primary text-white px-4 py-2 rounded-button hover:bg-primaryHover"
                onClick={handleUrlSubmit}
              >
                Submit URL
              </button>
            </div>
          )}
          
          {/* Hiển thị input file để upload ảnh*/}
          {selectedCheckbox === 'PhotoFileInput' && (
            <div className="mb-4 p-2 border border-gray-300 rounded">
              {previewImage && (
                <img src={previewImage} alt="Preview" className="w-64 h-40 object-cover mb-2" />
              )}
              <input type="file" onChange={handleImageChange} className="mb-2" />
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primaryHover"
              >
                Upload Photo
              </button>
            </div>
          )}

          {/* Mô tả công thức */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Thành phần nguyên liệu */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Ingredients</h2>
            <div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center my-2">
                  <img src={ingredient.image} alt={ingredient.name} className="w-10 h-10 mr-2" />
                  <span className="mr-2">{ingredient.name}</span>
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) =>
                      setIngredients(
                        ingredients.map((ing, i) =>
                          i === index ? { ...ing, amount: e.target.value } : ing
                        )
                      )
                    }
                    className="w-16 p-1 border rounded mr-2"
                  />
                  <span className="mr-2">{ingredient.unit}</span>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                onClick={() => addIngredient({ name: 'Sample Ingredient', amount: 1, unit: 'cup' })}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Add ingredient
              </button>
            </div>
          </div>

          {/* Các phần bổ sung khác */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Directions</h2>
            <textarea className="w-full p-2 border rounded-lg" rows="4" placeholder="Add directions..." />
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Nutritional Information</h2>
            <textarea className="w-full p-2 border rounded-lg" rows="2" placeholder="Enter nutritional information" />
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Notes</h2>
            <textarea className="w-full p-4 border rounded-lg" rows="4" placeholder="Add notes..."></textarea>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmitRecipe}
              className="bg-primary hover:bg-primaryHover justify-end text-white px-4 py-2 w-[300px] rounded-button text-button"
            >
              Submit
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
