import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../services/recipes';
import competitionService from '../services/competitions';
import ingredientService from '../services/ingredient'
import { useNavigate } from 'react-router-dom';
import EditRecipePage from './EditRecipePage';

const UNIT = [
    'g', 'kg', 'mg', 'lb', 'lbs', 'ounce', 'ounces', 'oz',
    'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp',
    'teaspoon', 'teaspoons', 'small', 'medium', 'large', 'clove',
    'cloves', 'pint', 'piece', 'pieces',
];

const CreateEntryForCompetitionPage = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);
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

    console.log("Before useEffect: ", id);

    useEffect(() => {
        console.log("useEffect running with id:", id);
        const fetchRegistrationStatus = async () => {
            try {
              const registered = await competitionService.checkIsRegistered(id); // Gọi API
              if (!registered) {
                alert("You haven't registered to this competition!")
                navigate(`competitions/${id}/information`)
              }
              console.log("hihi")
            } catch (error) {
              console.error('Error fetching registration status:', error.message);
            }
        };

        const fetchCompetition = async () => {
            try {
                const data = await competitionService.getDetail(id);
                console.log("haha: ", data)
                if (data) {
                    setCompetition(data);
                } else {
                    console.error('No competition found for the given ID');
                }
            } catch (error) {
                console.error('Error fetching competition:', error);
            }
        };

        fetchRegistrationStatus()
        fetchCompetition();
    }, [id]);

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

    // ... các hàm xử lý form giống như trong CreateRecipePage ...
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
    const handleAmountChange = (index, delta) => {
        setFormData((prevFormData) => {
            const updatedIngredients = [...prevFormData.ingredients];
            updatedIngredients[index].amount = Math.max(0, updatedIngredients[index].amount + delta); // Đảm bảo amount >= 0
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
        setUnit(UNIT[0]); // Reset unit về giá trị mặc định
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const recipeData = {
                ...formData,
            };

            await recipeService.createCompetitionEntry(recipeData, id);
            alert('Đã nộp bài dự thi thành công!');
            // Chuyển hướng về trang chi tiết cuộc thi
            navigate(`/competitions/${id}/information`);
        } catch (error) {
            console.error('Lỗi khi tạo bài dự thi:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Tạo Bài Dự Thi</h1>
            
            {/* Hiển thị thông tin cuộc thi */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                {competition ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">{competition.title || 'No title available'}</h2>
                    <p className="mb-2">{competition.description || 'No description available'}</p>
                    <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Chi tiết cuộc thi:</h3>
                        {/* Sử dụng dangerouslySetInnerHTML nếu competition.detailDescription có dữ liệu */}
                        <div dangerouslySetInnerHTML={{ __html: competition.detailDescription || 'No details available' }} />
                    </div>
                </>
                ) : (
                    // Hiển thị thông báo nếu competition chưa được tải hoặc không có dữ liệu
                    <p>Loading competition details...</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... các trường form giống như trong CreateRecipePage ... */}
                {/* Tiêu đề */}
                <div>
                    <label className="block font-medium mb-2">Tên món ăn</label>
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
                    <label className="block font-medium mb-2">Hình ảnh món ăn</label>
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
                            Tải ảnh lên
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
                    <label className="block font-medium mb-2">Mô tả tổng quan (Summary)</label>
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
                </div>

                {/* Nguyên liệu */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">Ingredients</h2>
                    <table className="w-full text-left border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">No.</th>
                                <th className="border border-gray-300 p-2">Item</th>
                                <th className="border border-gray-300 p-2">Amount</th>
                                <th className="border border-gray-300 p-2">Unit</th>
                                <th className="border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.ingredients.map((ingredient, index) => (
                                <tr key={index} className="border-b">
                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 items-center gap-2">
                                        {/* {ingredient.image && (
                                            <img src={ingredient.image} alt={ingredient.name} className="w-6 h-6 object-cover rounded-full" />
                                        )} */}
                                        {ingredient.name}
                                    </td>
                                    <td className="border border-gray-300 p-2 items-center">
                                        <button
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
                                            onClick={() => handleAmountChange(index, 1)}
                                            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-2 rounded"
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <select
                                            value={ingredient.unit}
                                            onChange={(e) => handleAmountInputChange(index, e.target.value)}
                                            className="border rounded-md p-1"
                                        >
                                            {UNIT.map((unitOption) => (
                                                <option key={unitOption} value={unitOption}>
                                                    {unitOption}
                                                </option>
                                            ))}
                                        </select>
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
                            <p>
                                <strong>Selected Ingredient:</strong> {selectedIngredient.name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="border rounded-md p-2"
                                >
                                    {UNIT.map((unitOption) => (
                                        <option key={unitOption} value={unitOption}>
                                            {unitOption}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddIngredient}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Ingredient
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hướng dẫn nấu Instruction */}
                <div>
                    <label className="block font-medium mb-2">Các bước thực hiện</label>
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

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primaryHover"
                >
                    Submit Entry
                </button>
            </form>
            
        </div>
    );
};

export default CreateEntryForCompetitionPage;