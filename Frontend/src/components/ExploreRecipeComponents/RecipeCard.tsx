import React from 'react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  id: number; // Thêm id để xác định công thức
  name: string;
  time: number;
  rating: number;
  image: string;
}

// const RecipeCard: React.FC<RecipeCardProps> = ({ id, name, time, rating, image }) => (
//   <Link to={`/recipes/${id}/information`} className="flex flex-col gap-3">
//     <img src={image} alt={name} className="w-full h-40 object-cover rounded-xl" />
//     <div className='h-[230px]'>
//       <h3 className="text-base font-medium text-[#181311]">{name}</h3>
//       <p className="text-sm text-[#8a7060]">{time} min · {rating} ★</p>
//     </div>
//   </Link>
// );

const RecipeCard: React.FC<RecipeCardProps> = ({ id, name, time, rating, image }) => (
  <Link to={`/recipes/${id}/information`} className="flex flex-col gap-3">
    <img src={image} alt={name} className="w-full h-40 object-cover rounded-xl" />
    <div className="h-[230px] flex flex-col justify-between">
      <h3 
        className="text-base font-medium text-[#181311] overflow-hidden text-ellipsis"
        style={{ height: '40px', whiteSpace: 'nowrap' }}
      >
        {name}
      </h3>
      <p className="text-sm text-[#8a7060]">{time} min · {rating} ★</p>
    </div>
  </Link>
);


export default RecipeCard;