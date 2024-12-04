import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactLogo from '../assets/react.svg';
import { getRecipeInstructions } from '../services/recipeInstructions';
import { getRecipeIngredients } from '../services/recipeIngredients';
import { getRecipeComments, addComment } from '../services/recipeComments';
import { getRecipeRatings, addOrUpdateRating, getUserRating } from '../services/recipeRatings';
import { getRecipeById } from '../services/recipes';
import { addFavourite, removeFavourite, checkFavourite } from '../services/favourites';
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
const Recipes = () => {
    let userId;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userIn = JSON.parse(storedUser);
        userId = userIn.id;

    }
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
                // const userId = 1; // Replace with actual user ID
                // const userInfo = await getUserInfo(userId);
                // setUser(userInfo);

                const recipeData = await getRecipeById(id);
                setRecipe(recipeData);

                const isFav = await checkFavourite(userId, id);
                console.log('CHECK THIS LINE', userId, isFav);
                setIsFavourite(isFav);

                const instructionsData = await getRecipeInstructions(id);
                setInstructions(instructionsData);

                const ingredientsData = await getRecipeIngredients(id);
                setIngredients(ingredientsData);

                const commentsData = await getRecipeComments(id);
                setComments(commentsData);

                const ratingsData = await getRecipeRatings(id);
                setUserRating(ratingsData.ratings);
                setAverageRating(ratingsData.averageRating);

                // Fetch user's rating
                const userRatingData = await getUserRating(userId, id);
                setUserRating(userRatingData.rating);

                //Retrieve user information from localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    console.log('User:', JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleAddComment = async (commentText) => {
        try {
            if (!user) {
                console.error('User not logged in');
                return;
            }
            const userId = user.id; // Replace with actual user ID
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
        if (isFavourite) {
            await removeFavourite(userId, id);
            setIsFavourite(false);
        } else {
            await addFavourite(userId, id);
            console.log('added');
            setIsFavourite(true);
        }
    };

    const handleAddRating = async (rating) => {
        try {
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

                    {comments.map(comment => (
                        <div className="flex w-full flex-row items-start justify-start gap-3 p-4" key={comment.id}>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style={{ backgroundImage: `url(${formatImageUrl(comment.User.image)})` }}></div>
                            <div>
                                <p className="text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">{comment.User?.username}</p>
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