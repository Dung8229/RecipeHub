import React from 'react';

interface RecipeCardProps {
  name: string;
  time: number;
  rating: number;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, time, rating, image }) => (
  <div className="flex flex-col gap-3">
    <img src={image} alt={name} className="w-full h-40 object-cover rounded-xl" />
    <div>
      <h3 className="text-base font-medium text-[#181311]">{name}</h3>
      <p className="text-sm text-[#8a7060]">{time} min · {rating} ★</p>
    </div>
  </div>
);

export default RecipeCard;