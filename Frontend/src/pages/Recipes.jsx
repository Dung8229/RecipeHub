import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { getRecipeInstructions } from '../services/recipeInstructions';
import { getRecipeIngredients } from '../services/recipeIngredients';
import { getRecipeComments, addComment } from '../services/recipeComments';
import { getRecipeRatings, addOrUpdateRating, getUserRating } from '../services/recipeRatings';
import { getRecipeById } from '../services/recipes';
import { addFavourite, removeFavourite, checkFavourite } from '../services/favourites';
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
const Recipes = () => {
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
    const printRef = useRef();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const userId = 1; // Replace with actual user ID
                // const userInfo = await getUserInfo(userId);
                // setUser(userInfo);

                const recipeData = await getRecipeById(id);
                setRecipe(recipeData);

                const instructionsData = await getRecipeInstructions(id);
                setInstructions(instructionsData);

                const ingredientsData = await getRecipeIngredients(id);
                setIngredients(ingredientsData);

                const commentsData = await getRecipeComments(id);
                setComments(commentsData);

                const ratingsData = await getRecipeRatings(id);
                setUserRating(ratingsData.ratings);
                setAverageRating(ratingsData.averageRating);

                const isFav = await checkFavourite(userId, id);
                setIsFavourite(isFav);

                // Fetch user's rating
                const userRatingData = await getUserRating(userId, id);
                setUserRating(userRatingData.rating);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);
    const userName = 'user1'
    const handleAddComment = async (commentText) => {
        try {
            const userId = 1; // Replace with actual user ID
            const newComment = await addComment(userId, id, commentText);
            setComments((prevComments) => [
                ...prevComments,
                { ...newComment, User: user }, // Add user info to the new comment
            ]);
            setCommentText(''); // Clear the comment input after submission
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleFavouriteClick = async () => {
        const userId = 1; // Replace with actual user ID
        if (isFavourite) {
            await removeFavourite(userId, id);
            setIsFavourite(false);
        } else {
            await addFavourite(userId, id);
            setIsFavourite(true);
        }
    };

    const handleAddRating = async (rating) => {
        try {
            const userId = 1; // Replace with actual user ID
            await addOrUpdateRating(userId, id, rating);
            setUserRating(rating);
            // Optionally, you can update the average rating after adding the user rating
            const recipeData = 100034;
            //setAverageRating(recipeData.averageRating);
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };

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
                                <div className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em]  pb-3 pt-5">Serving: {recipe.servings}</div>
                                <button
                                    onClick={handleFavouriteClick}
                                    className="flex items-center justify-center cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32px"
                                        height="32px"
                                        viewBox="0 0 24 24"
                                        fill={isFavourite ? "#f47f25" : "none"}
                                        stroke="#f47f25"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
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

                    <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4"><p>Average Rating: {averageRating.toFixed(2)}</p></h3>

                    <div className="flex items-center gap-2">
                        <div className="text-[#9c6d49]">

                        </div>
                        <div className="flex">
                            {renderStars(averageRating, null, null, null, 32)} {/* Display average rating as stars */}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-start">
                            <p className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
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
                    {comments.map(comment => (
                        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style={{ backgroundImage: "url('https://cdn.usegalileo.ai/stability/f1fbbb2c-4991-4c1c-bfd6-6fb5fe85bb77.png')" }}></div>
                            <div className="flex h-full flex-1 flex-col items-start justify-start">
                                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                                    <p className="text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">{userName}</p>

                                </div>
                                <p className="text-[#1c130d] text-sm font-normal leading-normal">{comment.commentText}</p>
                                <div className="flex w-full flex-row items-center justify-start gap-9 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[#9c6d49]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                                            </svg>
                                        </div>
                                        <p className="text-[#9c6d49] text-sm font-normal leading-normal">12</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[#9c6d49]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center px-4 py-3 gap-3">
                        <input
                            placeholder="Add a public comment..."
                            className="form-input w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#1c130d] focus:outline-0 focus:ring-0 border-none bg-[#f4ece7] focus:border-none h-full placeholder:text-[#9c6d49] px-4 text-base"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddComment(commentText)}
                            className="bg-[#f47f25] text-white px-4 py-2 rounded-lg font-bold"
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