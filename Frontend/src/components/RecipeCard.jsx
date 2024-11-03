import React from "react";

const RecipeCard = ({ recipe }) => {
    return (
        <div className="bg-white round-lg overflow-hidden">
            <img src={recipe.image} alt={recipe.title} className="w-full h-44 object-cover rounded-lg" />
            <div className="p-4">
                <h3 className="text-base font-medium">{recipe.title}</h3>
            </div>
        </div>
    );
};

export default RecipeCard;