import { useState } from 'react';
import LeaderboardItem from './LeaderboardItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Leaderboard = ({ entries }) => {
  const [visibleEntries, setVisibleEntries] = useState(5);

  const handleSeeMore = () => {
    setVisibleEntries(visibleEntries + 5);
  };

  return (
    <div className="relative">
    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div> */}
    <div className='bubbles relative flex'>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star15'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star18'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star16'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star19'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star15'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star18'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star16'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star19'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star15'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star18'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star16'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star19'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star15'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star18'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star16'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      <span className='relative size-8 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star19'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
    </div>
      <h2 className="text-3xl mb-4 md:text-5xl md:mb-8 text-primary font-bold  text-center relative" style={{ fontFamily: "'Pacifico', cursive" }}>
        <span className="relative z-10 bg-white px-2">Leaderboard</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-primary"></div>
        </div>
      </h2>
      <ul className="max-w-4xl mx-auto">
        {entries.slice(0, visibleEntries).map((entry, index) => (
          <LeaderboardItem
            key={entry.id}
            rank={index + 1}
            username={entry.username}
            recipeTitle={entry.recipeTitle}
            recipeImage={entry.recipeImage}
            totalVotes={entry.totalVotes}
            score={entry.score}
            onClick={() => window.location.href = `/recipe/${entry.id}`}
          />
        ))}
      </ul>
      {visibleEntries < entries.length && (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          onClick={handleSeeMore}
        >
          See More
        </button>
      )}
    </div>
  );
};


export default Leaderboard