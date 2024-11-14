import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getRecipeInstructions } from '../services/recipeInstructions';
import { getRecipeIngredients } from '../services/recipeIngredients';
import { getRecipeComments, addComment } from '../services/recipeComments';
import { getRecipeRatings } from '../services/recipeRatings';
import { getRecipeById } from '../services/recipes';
import { addFavourite, removeFavourite, checkFavourite } from '../services/favourites';

const Recipes = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [instructions, setInstructions] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);

    const userId = 1; // Giả sử userId là 1

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipeData = await getRecipeById(id);
                setRecipe(recipeData);

                const instructionsData = await getRecipeInstructions(id);
                setInstructions(instructionsData);

                const ingredientsData = await getRecipeIngredients(id);
                setIngredients(ingredientsData);

                const commentsData = await getRecipeComments(id);
                setComments(commentsData);

                const ratingsData = await getRecipeRatings(id);
                setRatings(ratingsData.ratings);
                setAverageRating(ratingsData.averageRating);

                const isFav = await checkFavourite(userId, id);
                setIsFavourite(isFav);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleAddComment = async (comment) => {
        const newComment = await addComment(userId, id, comment);
        setComments(prevComments => [...prevComments, newComment]);
    };

    const handleFavouriteClick = async () => {
        if (isFavourite) {
            await removeFavourite(userId, id);
            setIsFavourite(false);
        } else {
            await addFavourite(userId, id);
            setIsFavourite(true);
        }
    };

    const handleRatingSubmit = async () => {
        try {
            await addRating(userId, id, rating); // Gọi API thêm đánh giá
            const ratingsData = await getRecipeRatings(id);
            setRatings(ratingsData.ratings);
            setAverageRating(ratingsData.averageRating);
        } catch (error) {
            console.error("Error adding rating:", error);
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (

        <div>
            <div className="px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    <div
                        className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#fcfaf8] min-h-[218px] w-full h-full rounded-xl @[480px]:rounded-xl"
                        style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url(${recipe.image})` }}
                    >
                        <div className="flex p-4">
                            <p className="text-white tracking-light text-[28px] font-bold leading-tight">{recipe.title}</p>
                        </div>
                    </div>

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
                        {/* {instructions.map((step, index) => (
                            <label key={index} className="flex gap-x-3 py-3 flex-row">
                                <input type="checkbox" className="h-5 w-5 rounded border-[#e8dace] border-2 bg-transparent text-[#f47f25] checked:bg-[#f47f25] checked:border-[#f47f25] focus:ring-0 focus:ring-offset-0 focus:border-[#e8dace] focus:outline-none" />
                                <p className="text-[#1c130d] text-base font-normal leading-normal">{step}</p>
                            </label>
                        ))} */}
                        {instructions.map(instruction => (
                            <li key={instruction.id}>
                                Step {instruction.stepNumber}: {instruction.content}
                            </li>
                        ))}
                    </div>
                    <div className="flex px-4 py-3 justify-start">
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

                    <h2 className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Nutrition Facts</h2>
                    <div className="p-4 grid grid-cols-2">
                        {[
                            { label: "Calories", value: "520" },
                            { label: "Total Fat", value: "25g" },
                            { label: "Cholesterol", value: "90mg" },
                            { label: "Sodium", value: "890mg" },
                            { label: "Carbohydrates", value: "45g" },
                            { label: "Protein", value: "30g" }
                        ].map((fact, index) => (
                            <div key={index} className={`flex flex-col gap-1 border-t border-solid border-t-[#e8dace] py-4 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
                                <p className="text-[#9c6d49] text-sm font-normal leading-normal">{fact.label}</p>
                                <p className="text-[#1c130d] text-sm font-normal leading-normal">{fact.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex px-4 py-3 justify-start">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f4ece7] text-[#1c130d] text-base font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Print recipe</span>
                        </button>
                    </div>
                    <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comments</h3>
                    {comments.map(comment => (
                        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style={{ backgroundImage: "url('https://cdn.usegalileo.ai/stability/f1fbbb2c-4991-4c1c-bfd6-6fb5fe85bb77.png')" }}></div>
                            <div className="flex h-full flex-1 flex-col items-start justify-start">
                                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                                    <p className="text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">{comment.User.username}</p>
                                    <p className="text-[#9c6d49] text-sm font-normal leading-normal">1 hour ago</p>
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
                            // value={comment.commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddComment(commentText)}
                            className="bg-[#f47f25] text-white px-4 py-2 rounded-lg font-bold"
                        >
                            Add Comment
                        </button>
                    </div>


                    {/* Rating Section */}
                    <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4"><p>Average Rating: {averageRating.toFixed(2)}</p></h3>
                    <div className="px-4 flex items-center gap-2">
                        <select
                            value={ratings}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="bg-[#f4ece7] rounded-lg px-2 py-1 text-[#1c130d]"
                        >
                            <option value={0}>Rate this recipe</option>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num} stars</option>
                            ))}
                        </select>
                        <button
                            onClick={handleRatingSubmit}
                            className="bg-[#f47f25] text-white px-4 py-2 rounded-lg font-bold"
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Recipes;