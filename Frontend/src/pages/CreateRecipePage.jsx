import React, { useState } from 'react';
import recipeService from '../services/recipes';

const CreateRecipePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        imageURL: '',
        imageFile: null,
        imageSource: 'url',
        summary: '',
        readyInMinutes: '',
        servings: '',
        difficulty: 'beginer',
        ingredients: [{ amount: '', unit: '', name: '' }],
        instructions: [{ stepNumber: 1, content: '' }],
        tags: [''],
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Chuẩn bị dữ liệu để gửi
            const recipeData = {
                title: formData.title,
                imageFile: formData.imageFile,
                imageURL: formData.imageURL,
                summary: formData.summary,
                readyInMinutes: parseInt(formData.readyInMinutes),
                servings: parseInt(formData.servings),
                difficulty: formData.difficulty,
                ingredients: formData.ingredients,
                instructions: formData.instructions,
                tags: formData.tags.filter(tag => tag.trim() !== '')
            };

            // Gọi API tạo công thức mới
            const newRecipe = await recipeService.create(recipeData);
            alert('Tạo công thức thành công!');

            // Reset form
            setFormData({
                title: '',
                imageURL: '',
                imageFile: null,
                imageSource: 'url',
                summary: '',
                readyInMinutes: '',
                servings: '',
                difficulty: 'beginer',
                ingredients: [{ amount: '', unit: '', name: '' }],
                instructions: [{ stepNumber: 1, content: '' }],
                tags: [''],
            });
        } catch (error) {
            console.error('Lỗi khi tạo công thức:', error);
            alert('Không thể tạo công thức.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Tạo Công Thức Mới</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <label className="block font-medium mb-2">Mô tả tổng quan</label>
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
                    <div>
                        <label className="block font-medium mb-2">Độ khó</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="beginer">Người mới bắt đầu</option>
                            <option value="intermediate">Trung bình</option>
                            <option value="advanced">Nâng cao</option>
                            <option value="expert">Chuyên nghiệp</option>
                            <option value="masterchef">Masterchef</option>
                        </select>
                    </div>
                </div>

                {/* Nguyên liệu */}
                <div>
                    <label className="block font-medium mb-2">Nguyên liệu</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="number"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                className="w-20 px-3 py-2 border rounded-md"
                                placeholder="Số lượng"
                                required
                            />
                            <input
                                type="text"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                className="w-24 px-3 py-2 border rounded-md"
                                placeholder="Đơn vị"
                                required
                            />
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md"
                                placeholder="Tên nguyên liệu"
                                required
                            />
                            {formData.ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngredient(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Thêm nguyên liệu
                    </button>
                </div>

                {/* Hướng dẫn nấu */}
                <div>
                    <label className="block font-medium mb-2">Các bước thực hiện</label>
                    {formData.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <span className="px-3 py-2 bg-gray-100 rounded-md">
                                Bước {instruction.stepNumber}
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
                        Thêm bước
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
                        Thêm tag
                    </button>
                </div>

                {/* Nút Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primaryHover"
                >
                    Tạo Công Thức
                </button>
            </form>
        </div>
    );
};

export default CreateRecipePage;