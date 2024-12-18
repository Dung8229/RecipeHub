import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactLogo from '../assets/react.svg';
import { getRecipeInstructions } from '../services/recipeInstructions';
import { getRecipeIngredients } from '../services/recipeIngredients';
import { getRecipeComments, addComment } from '../services/recipeComments';
import { getRecipeRatings, addOrUpdateRating, getUserRating } from '../services/recipeRatings';
import { getRecipeById } from '../services/recipes';
import { addFavourite, removeFavourite, checkFavourite } from '../services/favourites';
import { addShoppingListRecipes, deleteShoppingListRecipes, checkShoppingList } from '../services/shoppingList';
import { FaStar, FaRegStar } from "react-icons/fa";
import tokenService from '../services/token';
const Recipes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [instructions, setInstructions] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [user, setUser] = useState(null);
    const [isInShoppingList, setIsInShoppingList] = useState(false);
    const printRef = useRef();
    let userId;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await tokenService.getUserInfo();

                if (userInfo) {
                    setUser(userInfo);
                    userId = userInfo.id;

                }
                if (!userId) {
                    console.error('User not logged in');
                }
                // Thực hiện các lệnh gọi API đồng thời nhưng không để lỗi một API ngăn cản các API khác
                const results = await Promise.allSettled([
                    getRecipeById(id),
                    getRecipeInstructions(id),
                    getRecipeIngredients(id),
                    getRecipeComments(id),
                    getRecipeRatings(id),
                    checkFavourite(userId, id),
                    checkShoppingList(userId, id),
                    getUserRating(userId, id),
                ]);

                // Xử lý từng kết quả
                const [recipeRes, instructionsRes, ingredientsRes, commentsRes, ratingsRes, isFavRes, shoppingListRes, userRatingRes] = results;

                if (recipeRes.status === "fulfilled") setRecipe(recipeRes.value);
                else console.error("Error fetching recipe:", recipeRes.reason);

                if (instructionsRes.status === "fulfilled") setInstructions(instructionsRes.value);
                else console.warn("No instructions available.");

                if (ingredientsRes.status === "fulfilled") setIngredients(ingredientsRes.value);
                else console.warn("No ingredients found.");

                if (commentsRes.status === "fulfilled") {
                    console.log("comment:", commentsRes.value)
                    setComments(commentsRes.value);
                }
                else console.warn("Unable to load comments.");

                if (ratingsRes.status === "fulfilled") {
                    setUserRating(ratingsRes.value.ratings);
                    setAverageRating(ratingsRes.value.averageRating);
                } else {
                    console.warn("Ratings not available.");
                }

                if (isFavRes.status === "fulfilled") setIsFavourite(isFavRes.value);
                else console.warn("Unable to check favourite status.");

                if (shoppingListRes.status === "fulfilled") {
                    console.log("shopping list data:", shoppingListRes)
                    setIsInShoppingList(shoppingListRes.value);
                }
                else console.warn("Shopping list status not available.");

                if (userRatingRes.status === "fulfilled") setUserRating(userRatingRes.value.rating);
                else console.warn("Unable to fetch user rating.");
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);


    const handleAddComment = async (commentText) => {
        try {
            const newComment = await addComment(id, commentText);
            console.log("handle add comment:", newComment)
            console.log("user comment:",user)
            setComments((prevComments) => [
                ...prevComments,
                { ...newComment, User: user }, // Add user info to the new comment
            ]);
            setCommentText(''); // Clear the comment input after submission
        } catch (error) {
            console.error('Error adding comment:', error);
            if (error.status && error.response.status === 403) {
                console.error('User not logged in');
                navigate('/login');
            }
        }
    };

    const handleFavouriteClick = async () => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login');
        }
        if (isFavourite) {
            await removeFavourite(user.id, id);
            setIsFavourite(false);
        } else {
            await addFavourite(user.id, id);
            setIsFavourite(true);
        }
    };

    const handleAddRating = async (rating) => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login');
        }
        try {
            await addOrUpdateRating(user.id, id, rating);
            setUserRating(rating);
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };
    const handleAddShoppingList = async () => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login');
        }
        try {
            if (isInShoppingList) {
                await deleteShoppingListRecipes(user.id, id);
                setIsInShoppingList(false);
            } else {
                await addShoppingListRecipes(user.id, id);
                setIsInShoppingList(true);
            }
        } catch (error) {
            console.error('Error adding to shopping list:', error);
        }
    }

    const renderStars = (rating, onClick, onMouseEnter, onMouseLeave, size = 24) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <FaStar
                        key={i}
                        size={size}
                        color="#f47f25"
                        onClick={() => onClick && onClick(i)}
                        onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
                        onMouseLeave={() => onMouseLeave && onMouseLeave()}
                    />
                );
            } else {
                stars.push(
                    <FaRegStar
                        key={i}
                        color="#f47f25"
                        size={size}
                        onClick={() => onClick && onClick(i)}
                        onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
                        onMouseLeave={() => onMouseLeave && onMouseLeave()}
                    />
                );
            }
        }
        return stars;
    };

    const handlePrint = () => {
        window.print();
    }

    const formatImageUrl = (url) => url.replace(/\\/g, '/');


    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (

        <div >
            <div className="px-40 flex flex-1 justify-center h-full py-5">
                <div className="layout-content-container flex flex-col max-w-[960px] h-full flex-1">
                    <div className="printable">
                        <div
                            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#fcfaf8] w-full rounded-xl aspect-[16/9] @[480px]:rounded-xl"
                            style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25% ), url(${recipe.image})` }}
                        >
                            <div className="flex p-4">
                                <p className="text-white tracking-light text-[28px] font-bold leading-tight">{recipe.title}</p>
                                <div className="flex px-4 py-3 justify-start">

                                </div>
                            </div>

                        </div>

                        <div ref={printRef}>
                            <div className="flex items-center justify-between px-4">
                                {/* Serving Info */}
                                <div className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                                    Serving: {recipe.servings}
                                </div>

                                {/* Buttons Section */}
                                <div className="flex items-center space-x-2"> {/* Group buttons with spacing */}
                                    {/* Favourite Button */}
                                    <button
                                        onClick={handleFavouriteClick}
                                        className="flex items-center justify-center cursor-pointer w-8 h-8" // Added fixed size
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill={isFavourite ? "#f47f25" : "none"}
                                            stroke="#f47f25"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                    </button>

                                    {/* Shopping Button */}
                                    <button onClick={handleAddShoppingList} className="flex items-center justify-center cursor-pointer w-8 h-8">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 576 512"
                                            fill={isInShoppingList ? "#f47f25" : "#fff"}
                                            stroke="#f47f25"
                                        >
                                            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20l44 0 0 44c0 11 9 20 20 20s20-9 20-20l0-44 44 0c11 0 20-9 20-20s-9-20-20-20l-44 0 0-44c0-11-9-20-20-20s-20 9-20 20l0 44-44 0c-11 0-20 9-20 20z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>


                            <div className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Ready Time: {recipe.readyInMinutes} minutes</div>
                            <h2 className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Description</h2>
                            <div className="px-4">
                                <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
                            </div>
                            <h2 className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Ingredients</h2>
                            <div className="px-4">

                                {ingredients.map(ingredient => (
                                    <li key={ingredient.id}>
                                        {ingredient.amount} {ingredient.unit} {ingredient.Ingredient.name}
                                    </li>
                                ))}
                            </div>
                            <h2 className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Cooking Directions</h2>
                            <div className="px-4">
                                {instructions.map(instruction => (
                                    <li key={instruction.id}>
                                        Step {instruction.stepNumber}: {instruction.content}
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="flex px-4 py-3 justify-start">
                        <button onClick={handlePrint} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f4ece7] text-[#1c130d] text-base font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Print recipe</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-8 px-4 py-3 justify-start">
                        {/* Average Rating */}
                        <div className="flex flex-col gap-4 items-start">
                            <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                                Average Rating: {averageRating.toFixed(2)}/5
                            </h3>
                            <div className="flex items-center ">
                                <div className="text-[#9c6d49]"></div>
                                <div className="flex">
                                    {renderStars(averageRating, null, null, null, 32)} {/* Display average rating as stars */}
                                </div>
                            </div>
                        </div>

                        {/* User Rating */}
                        <div className="flex flex-col gap-4 items-start">
                            <p className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                                Rate this recipe
                            </p>
                            <div className="flex items-center gap-2">
                                {renderStars(
                                    hoverRating || userRating,
                                    handleAddRating,
                                    setHoverRating,
                                    () => setHoverRating(0),
                                    32
                                )}
                            </div>
                        </div>
                    </div>

                    <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comments</h3>

                    {comments
                    ?.filter(comment => comment && comment.commentText) // Lọc bình luận hợp lệ
                    .map(comment => (
                        <div className="flex w-full flex-row items-start justify-start gap-3 p-4" key={comment.id}>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                            style={{ backgroundImage: `url(${formatImageUrl(comment.User?.image)})` }} // Đảm bảo không lỗi khi User hoặc image null
                        ></div>
                        <div>
                            <p className="text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">
                            {comment.User?.username || 'Unknown User'} {/* Hiển thị tên hoặc fallback */}
                            </p>
                            <p>{comment.commentText}</p>
                        </div>
                        </div>
                    ))}

                    <div className="flex items-center px-4 py-3 gap-3">
                        <input
                            placeholder="Add a public comment..."
                            className="form-input w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#1c130d] focus:outline-0 focus:ring-0 border-none bg-[#f4ece7] focus:border-none h-14 placeholder:text-[#9c6d49] px-4 text-base"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddComment(commentText)}
                            className="bg-[#f47f25] text-white px-4 py-2 rounded-lg h-14"
                        >
                            Add Comment
                        </button>
                    </div>






                </div>
            </div>

        </div>
    );
};

export default Recipes;