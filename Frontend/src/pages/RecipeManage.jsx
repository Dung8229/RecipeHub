import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router
import { getMyRecipes, deleteRecipe } from '../services/myRecipes';
import tokenService from '../services/token';
const RecipeManage = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 8;
    let userId; // Giả sử userId là 1, bạn có thể thay thế bằng giá trị thực tế
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRecipes = async () => {
            try {
                const userInfo = await tokenService.getUserInfo();
                if (!userInfo) navigate('/login');
                userId = userInfo.id;
                console.log('User ID:', userId);
                const userRecipes = await getMyRecipes(userId);
                setRecipes(userRecipes);
            } catch (error) {
                console.error('Error fetching user recipes:', error);
            }
        };

        fetchUserRecipes();
    }, [userId]);

    const handleDelete = async (recipeId) => {
        try {
            await deleteRecipe(userId, recipeId);
            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const currentRecipes = recipes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    return (
        <div className="max-w-6xl mx-auto bg-[#fcfaf8]">
            <div className="container mx-auto p-4">
                {/* Tiêu đề */}
                <h1 className="text-4xl font-bold text-[#1c130d] mb-6">My Recipes</h1>

                <main>
                    {/* Nếu không có công thức */}
                    {recipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <p className="text-2xl text-gray-600 mb-4">You have not created any recipe</p>
                            <button
                                onClick={() => navigate('recipes/create')}
                                className="px-6 py-2 bg-[#f47f25] text-white rounded-lg text-lg"
                            >
                                Create your new recipe
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Danh sách công thức */}
                            <div className="flex flex-col gap-4">
                                {currentRecipes.map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                                    >
                                        {/* Hình ảnh */}
                                        <div
                                            className="w-14 h-14 bg-cover bg-center rounded-lg cursor-pointer"
                                            style={{
                                                backgroundImage: `url(${recipe.image || '/path/to/placeholder.png'})`,
                                            }}
                                            onClick={() => navigate(`/recipes/my-recipes/${recipe.id}/edit`)} // Chuyển hướng khi nhấn ảnh
                                        ></div>

                                        {/* Thông tin */}
                                        <div className="flex-grow px-4">
                                            <p
                                                className="text-[#1c130d] text-lg font-medium cursor-pointer hover:underline"
                                                onClick={() => navigate(`/recipes/my-recipes/${recipe.id}/edit`)} // Chuyển hướng khi nhấn tên
                                            >
                                                {recipe.title}
                                            </p>
                                            <p className="text-sm text-[#9c6d49]">
                                                {recipe.readyInMinutes} minutes to finish
                                            </p>
                                        </div>

                                        {/* Nút Delete */}
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className="text-sm font-medium text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Phân trang */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className={`px-4 py-2 rounded-lg ${currentPage === 1
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-[#f47f25] text-white'
                                        }`}
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={endIndex >= recipes.length}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    className={`px-4 py-2 rounded-lg ${endIndex >= recipes.length
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-[#f47f25] text-white'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                            <p className="text-center text-sm mt-2">
                                Page {currentPage} of {totalPages}
                            </p>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecipeManage;
