import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EditRecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Sử dụng state giống CreateRecipePage
    const [formData, setFormData] = useState({
        title: '',
        imageURL: '',
        imageFile: null,
        imageSource: 'url',
        image: '', // Thêm trường này để lưu ảnh hiện tại
        summary: '',
        readyInMinutes: '',
        servings: '',
        difficulty: 'beginer',
        ingredients: [{ amount: '', unit: '', name: '' }],
        instructions: [{ stepNumber: 1, content: '' }],
        tags: [''],
    });

    // Thêm useEffect để load dữ liệu công thức
    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const recipe = await recipeService.getRecipeById(id);
                setFormData({
                    title: recipe.title,
                    imageURL: '',
                    imageFile: null,
                    imageSource: 'url',
                    image: recipe.image,
                    summary: recipe.summary,
                    readyInMinutes: recipe.readyInMinutes,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    tags: recipe.tags,
                });
            } catch (error) {
                console.error('Error loading recipe:', error);
                alert('Không thể tải thông tin công thức');
                navigate('/recipes'); // Chuyển về trang danh sách nếu có lỗi
            }
        };

        loadRecipe();
    }, [id, navigate]);

    // Giữ nguyên các hàm xử lý như CreateRecipePage
    // handleChange, handleIngredientChange, handleAddIngredient, etc.
    const handleChange = (e) => {
      const { name, value, type, files } = e.target;

      if (type === 'file') {
          setFormData(prevData => ({
              ...prevData,
              imageFile: files[0],
              imageURL: '',
          }));
      } else if (name === 'imageSource') {
          setFormData(prevData => ({
              ...prevData,
              [name]: value,
              imageFile: null,
              imageURL: '',
          }));
      } else {
          setFormData(prevData => ({
              ...prevData,
              [name]: value,
          }));
      }
  };

  // Xử lý thay đổi nguyên liệu
  const handleIngredientChange = (index, field, value) => {
      const newIngredients = [...formData.ingredients];
      newIngredients[index] = {
          ...newIngredients[index],
          [field]: value
      };
      setFormData(prevData => ({
          ...prevData,
          ingredients: newIngredients
      }));
  };

  // Thêm nguyên liệu mới
  const handleAddIngredient = () => {
      setFormData(prevData => ({
          ...prevData,
          ingredients: [...prevData.ingredients, { amount: '', unit: '', name: '' }]
      }));
  };

  // Xóa nguyên liệu
  const handleRemoveIngredient = (index) => {
      setFormData(prevData => ({
          ...prevData,
          ingredients: prevData.ingredients.filter((_, i) => i !== index)
      }));
  };

  // Xử lý thay đổi bước hướng dẫn
  const handleInstructionChange = (index, value) => {
      const newInstructions = [...formData.instructions];
      newInstructions[index] = {
          stepNumber: index + 1,
          content: value
      };
      setFormData(prevData => ({
          ...prevData,
          instructions: newInstructions
      }));
  };

  // Thêm bước hướng dẫn mới
  const handleAddInstruction = () => {
      setFormData(prevData => ({
          ...prevData,
          instructions: [
              ...prevData.instructions,
              { stepNumber: prevData.instructions.length + 1, content: '' }
          ]
      }));
  };

  // Xóa bước hướng dẫn
  const handleRemoveInstruction = (index) => {
      setFormData(prevData => ({
          ...prevData,
          instructions: prevData.instructions
              .filter((_, i) => i !== index)
              .map((inst, i) => ({ ...inst, stepNumber: i + 1 }))
      }));
  };

  // Xử lý thay đổi tag
  const handleTagChange = (index, value) => {
      const newTags = [...formData.tags];
      newTags[index] = value;
      setFormData(prevData => ({
          ...prevData,
          tags: newTags
      }));
  };

  // Thêm tag mới
  const handleAddTag = () => {
      setFormData(prevData => ({
          ...prevData,
          tags: [...prevData.tags, '']
      }));
  };

  // Xóa tag
  const handleRemoveTag = (index) => {
      setFormData(prevData => ({
          ...prevData,
          tags: prevData.tags.filter((_, i) => i !== index)
      }));
  };

    // Chỉ cần sửa lại hàm handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const recipeData = {
                title: formData.title,
                imageFile: formData.imageFile,
                imageURL: formData.imageURL,
                image: formData.image, // Thêm trường này
                summary: formData.summary,
                readyInMinutes: parseInt(formData.readyInMinutes),
                servings: parseInt(formData.servings),
                difficulty: formData.difficulty,
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                tags: formData.tags.filter(tag => tag.trim() !== '')
            };

            await recipeService.update(id, recipeData);
            alert('Cập nhật công thức thành công!');
            navigate(`/recipes/${id}`); // Chuyển về trang chi tiết công thức
        } catch (error) {
            console.error('Lỗi khi cập nhật công thức:', error);
            alert('Không thể cập nhật công thức.');
        }
    };

    return (
        <div>
            <Header />
            <main className="pt-32">
                <div className="p-8 bg-gray-100 max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tiêu đề */}
                        <div>
                            <label className="block font-medium mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Phần upload ảnh */}
                        <div>
                            <label className="block font-medium mb-2">Recipe Image</label>
                            <div className="flex space-x-4 mb-2">
                                <label>
                                    <input
                                        type="radio"
                                        name="imageSource"
                                        value="url"
                                        checked={formData.imageSource === 'url'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    URL
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="imageSource"
                                        value="file"
                                        checked={formData.imageSource === 'file'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Image upload
                                </label>
                            </div>

                            {formData.imageSource === 'url' ? (
                                <input
                                    type="text"
                                    name="imageURL"
                                    value={formData.imageURL}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Nhập URL hình ảnh"
                                />
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        name="imageFile"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="w-full"
                                    />
                                    {formData.imageFile && (
                                        <img
                                            src={URL.createObjectURL(formData.imageFile)}
                                            alt="Preview"
                                            className="mt-2 max-w-xs rounded-md"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Adding summary */}
                        <div>
                            <label className="block font-medium mb-2">Summary (Description of your recipe)</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                                rows="4"
                                required
                            />
                        </div>

                        {/* Thời gian và khẩu phần */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium mb-2">Ready in minutes?</label>
                                <input
                                    type="number"
                                    name="readyInMinutes"
                                    value={formData.readyInMinutes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">How many people can serve?</label>
                                <input
                                    type="number"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="beginer">Beginer</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                    <option value="masterchef">Masterchef</option>
                                </select>
                            </div>
                        </div>

                        {/* Add Ingredients */}
                        <div>
                            <label className="block font-medium mb-2">Adding Ingredients</label>
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={ingredient.amount}
                                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                        className="w-24 px-3 py-2 border rounded-md"
                                        placeholder="amount"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={ingredient.unit}
                                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        className="w-32 px-3 py-2 border rounded-md"
                                        placeholder="unit"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md"
                                        placeholder="Ingredient name"
                                        required
                                    />
                                    {formData.ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="px-3 py-2 bg-red-500 rounded-md"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" className="text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddIngredient}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Add more ingredient
                            </button>
                        </div>

                        {/* Hướng dẫn nấu */}
                        <div>
                            <label className="block font-medium mb-2">Instruction</label>
                            {formData.instructions.map((instruction, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <span className="px-3 py-2 bg-gray-100 rounded-md">
                                        Step {instruction.stepNumber}
                                    </span>
                                    <textarea
                                        value={instruction.content}
                                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md"
                                        placeholder="Mô tả bước thực hiện"
                                        required
                                    />
                                    {formData.instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInstruction(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" className="text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddInstruction}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Add step
                            </button>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block font-medium mb-2">Tags</label>
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md"
                                        placeholder="Adding tag (ex: dinner, dairy_free, gluten_free, lunch, etc.)"
                                    />
                                    {formData.tags.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-md"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" className="text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Add tag
                            </button>
                        </div>

                        {/* Nút Submit */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="justify-center w-[300px] py-3 bg-primary text-white rounded-md hover:bg-primaryHover"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditRecipePage;
