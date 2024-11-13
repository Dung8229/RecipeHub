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

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{recipe.title}</h1>
            {recipe.image && <img src={recipe.image} alt={recipe.title} />}
            <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
            <h2>Instructions</h2>
            <ul>
                {instructions.map(instruction => (
                    <li key={instruction.id}>
                        Step {instruction.stepNumber}: {instruction.content}
                    </li>
                ))}
            </ul>
            <h2>Ingredients</h2>
            <ul>
                {ingredients.map(ingredient => (
                    <li key={ingredient.id}>
                        {ingredient.amount} {ingredient.unit} {ingredient.Ingredient.name}
                    </li>
                ))}
            </ul>
            <h2>Comments</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        <strong>{comment.User.username}:</strong> {comment.comment}
                    </li>
                ))}
            </ul>
            <textarea placeholder="Add a comment" onBlur={(e) => handleAddComment(e.target.value)} />
            <button onClick={handleFavouriteClick}>
                {isFavourite ? 'Unsave' : 'Save'}
            </button>
            <h2>Ratings</h2>
            <p>Average Rating: {averageRating.toFixed(2)}</p>
            <ul>
                {ratings.map(rating => (
                    <li key={rating.id}>
                        {rating.User.username}: {rating.rating} stars
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recipes;