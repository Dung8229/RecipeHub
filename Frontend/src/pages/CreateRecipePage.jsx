import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipes';
import ingredientService from '../services/ingredient';

const UNIT = [
    'g', 'kg', 'mg', 'lb', 'lbs', 'ounce', 'ounces', 'oz',
    'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp',
    'teaspoon', 'teaspoons', 'small', 'medium', 'large', 'clove',
    'cloves', 'pint', 'piece', 'pieces',
];

const CreateRecipePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        imageURL: '',
        imageFile: null,
        imageSource: 'url',
        summary: '',
        readyInMinutes: '',
        servings: '',
        ingredients: [],
        instructions: [{ stepNumber: 1, content: '' }],
        tags: [''],
    });

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [unit, setUnit] = useState(UNIT[0]);

    useEffect(() => {
        const fetchIngredients = async () => {
            if (query.trim()) {
                try {
                    const response = await ingredientService.search(query);
                    const filteredResults = response.filter(
                        (ingredient) =>
                            !formData.ingredients.some((item) => item.id === ingredient.id)
                    );
                    setSearchResults(filteredResults.length > 0 ? filteredResults : []);
                } catch (error) {
                    console.error('Error fetching ingredients:', error);
                }
            } else {
                setSearchResults([]);
            }
        };
        fetchIngredients();
    }, [query, formData.ingredients]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'file'
                    ? files[0]
                    : name === 'imageSource'
                    ? value === 'url'
                        ? ''
                        : value
                    : value,
            ...(name === 'imageSource' && { imageFile: null, imageURL: '' }),
        }));
    };
//////////Ingredients
    const handleAmountChange = (index, delta) => {
        setFormData((prevFormData) => {
            const updatedIngredients = [...prevFormData.ingredients];
            updatedIngredients[index].amount = Math.max(
                0,
                updatedIngredients[index].amount + delta
            ); // Đảm bảo amount >= 0
            return { ...prevFormData, ingredients: updatedIngredients };
        });
    };

    const handleAmountInputChange = (index, value) => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue) && numericValue >= 0) {
          setFormData((prevFormData) => {
            const updatedIngredients = [...prevFormData.ingredients];
            updatedIngredients[index].amount = numericValue;
            return { ...prevFormData, ingredients: updatedIngredients };
          });
        }
    };
    
    const handleRemoveIngredient = (index) => {
        setFormData((prevFormData) => {
          const updatedIngredients = [...prevFormData.ingredients];
          updatedIngredients.splice(index, 1); // Xóa phần tử tại vị trí index
          return { ...prevFormData, ingredients: updatedIngredients };
        });
    };

    const handleAddIngredient = () => {
        if (!selectedIngredient || !unit) return;
      
        const newIngredient = {
          id: selectedIngredient.id,
          name: selectedIngredient.name,
          image: selectedIngredient.image || null,
          amount: 1, // Mặc định là 1
          unit,
        };
      
        setFormData((prevFormData) => ({
          ...prevFormData,
          ingredients: [...prevFormData.ingredients, newIngredient],
        }));
      
        // Reset các giá trị sau khi thêm
        setSelectedIngredient(null);
        setQuery('');
        setUnit('');
    };
      
////Instruction
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

    const handleAddInstruction = () => {
        setFormData(prevData => ({
            ...prevData,
            instructions: [
                ...prevData.instructions,
                { stepNumber: prevData.instructions.length + 1, content: '' }
            ]
        }));
    };

    const handleRemoveInstruction = (index) => {
        setFormData(prevData => ({
            ...prevData,
            instructions: prevData.instructions
                .filter((_, i) => i !== index)
                .map((inst, i) => ({ ...inst, stepNumber: i + 1 }))
        }));
    };
//////////
/////////Tag
    const handleTagChange = (index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData(prevData => ({
            ...prevData,
            tags: newTags
        }));
    };

    const handleAddTag = () => {
        setFormData(prevData => ({
            ...prevData,
            tags: [...prevData.tags, '']
        }));
    };

    const handleRemoveTag = (index) => {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index)
        }));
    };
/////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const recipeData = {
                title: formData.title,
                imageFile: formData.imageFile,
                imageURL: formData.imageURL,
                summary: formData.summary,
                readyInMinutes: parseInt(formData.readyInMinutes),
                servings: parseInt(formData.servings),
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                tags: formData.tags.filter(tag => tag.trim() !== '')
            };

            const newRecipe = await recipeService.create(recipeData);
            alert('Tạo công thức thành công!');

            setFormData({
                title: '',
                imageURL: '',
                imageFile: null,
                imageSource: 'url',
                summary: '',
                readyInMinutes: '',
                servings: '',
                ingredients: [],
                instructions: [{ stepNumber: 1, content: '' }],
                tags: [''],
            });
        } catch (error) {
            console.error('Lỗi khi tạo công thức:', error);
            alert('Không thể tạo công thức.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create your new recipe!</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
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
                            Image Upload
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

                {/* Mô tả tổng quan */}
                <div>
                    <label className="block font-medium mb-2">Summary</label>
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
                        <label className="block font-medium mb-2">Thời gian nấu (phút)</label>
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
                        <label className="block font-medium mb-2">Khẩu phần (người)</label>
                        <input
                            type="number"
                            name="servings"
                            value={formData.servings}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    {/* <div>
                        <label className="block font-medium mb-2">Độ khó</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="beginer">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                            <option value="masterchef">Masterchef</option>
                        </select>
                    </div> */}
                </div>

                {/* Nguyên liệu */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">Ingredients</h2>
                    {/* Bảng nguyên liệu */}
                    <table className="w-full text-left border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">No.</th>
                                <th className="border border-gray-300 p-2">Item</th>
                                <th className="border border-gray-300 p-2">Amount</th>
                                <th className="border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.ingredients.map((ingredient, index) => (
                                <tr key={ingredient.id} className="border-b">
                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 gap-2">
                                        {/* {ingredient.image && (
                                            <img src={ingredient.image} alt={ingredient.name} className="w-6 h-6 object-cover rounded-full" />
                                        )} */}
                                        {ingredient.name}
                                    </td>
                                    <td className="border border-gray-300 p-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleAmountChange(index, -1)}
                                            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-2 rounded"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={ingredient.amount}
                                            onChange={(e) => handleAmountInputChange(index, e.target.value)}
                                            className="mx-2 w-12 text-center border border-gray-300 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAmountChange(index, 1)}
                                            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-2 rounded"
                                        >
                                            +
                                        </button>
                                        <span className="ml-2">{ingredient.unit}</span>
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Thêm nguyên liệu mới */}
                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search ingredients..."
                            className="flex-grow border rounded-md p-2"
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="bg-white border rounded-md mt-2 shadow-md">
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedIngredient(result);
                                        setQuery(result.name);
                                        setSearchResults([]);
                                    }}
                                >
                                    {result.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Chọn đơn vị đo lường và thêm */}
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
                                    Xóa
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddInstruction}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Add more
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
                                placeholder="Nhập tag (VD: món chính, món tráng miệng,...)"
                            />
                            {formData.tags.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Add more
                    </button>
                </div>

                {/* Nút Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primaryHover"
                >
                    Submit a new one
                </button>
            </form>
        </div>
    );
};

export default CreateRecipePage;
