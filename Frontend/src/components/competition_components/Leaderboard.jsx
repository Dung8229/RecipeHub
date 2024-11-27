import { useState } from 'react';
import LeaderboardItem from './LeaderboardItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';

const Leaderboard = ({ entries }) => {
  const [visibleEntries, setVisibleEntries] = useState(5);

  const handleSeeMore = () => {
    setVisibleEntries(visibleEntries + 5);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute inset-0 -z-10 h-full w-full bg-orange-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#FFAE19,transparent)]"></div></div>
      <div className='w-full absolute flex items-center'>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star10'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star14'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star13'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star13'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star19'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star15'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star12'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star11'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star16'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star17'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
        <span className='relative size-1/12 text-amber-400 odd:text-orange-600 mx-4 my-0 animate-star20'><FontAwesomeIcon className="animate-pulse" icon={faStar}/></span>
      </div>
      <h2 className="text-3xl mb-4 md:text-5xl md:mb-8 text-yellow-900 pt-8 text-center relative bg-[color:rgb(222,184,135)] border-2 border-[color:rgb(139,69,19)] rounded-lg p-4 shadow-md" style={{ fontFamily: "'Pacifico', cursive" }}>
        <span className="relative z-10 inline-flex items-baseline gap-x-5">
          <p className="">Leaderboard</p>  
          <FontAwesomeIcon className="" icon={faTrophy}/>
        </span>
      </h2>
      {(!entries || entries.length === 0) ? (
        <div className="text-red-700 text-center">
          No entries available yet. Be the first to participate!
        </div>
      ) : (
        <>
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
                onClick={() => window.location.href = `/recipe/${entry.recipeId}`}
              />
            ))}
          </ul>
          {visibleEntries < entries.length && (
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded my-4"
                onClick={handleSeeMore}
              >
                See More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default Leaderboard