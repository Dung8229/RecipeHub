import React from 'react';

const LeaderboardItem = ({ rank, username, recipeTitle, recipeImage, totalVotes, score, onClick }) => {
  const getContainerSize = () => {
    switch (rank) {
      case 1:
        return 'w-full'; // Hạng nhất chiếm toàn bộ chiều ngang
      case 2:
        return 'w-5/6'; // Hạng nhì chiếm 5/6 chiều ngang
      case 3:
        return 'w-4/5'; // Hạng ba chiếm 4/5 chiều ngang
      default:
        return 'w-3/4'; // Các hạng khác chiếm 3/4 chiều ngang
    }
  };

  const getRankClasses = () => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 border-4 border-yellow-500 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105'; // Viền đẹp và hiệu ứng hover cho hạng nhất
      case 2:
        return 'bg-gray-100 border-gray-400 transform transition-transform duration-300 hover:scale-105';
      case 3:
        return 'bg-orange-100 border-orange-500 transform transition-transform duration-300 hover:scale-105';
      default:
        return 'bg-blue-50 border-blue-300 transform transition-transform duration-300 hover:scale-105';
    }
  };

  const getMedalEmoji = () => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex mx-auto justify-between items-center p-4 mb-2cursor-pointer ${getContainerSize()} ${getRankClasses()}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="text-3xl font-bold mr-4">{getMedalEmoji() || rank}</div>
        <img src={recipeImage} alt={recipeTitle} className="w-20 h-20 rounded-md mr-3" />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-primary mb-1">{recipeTitle}</h3>
          <h4 className="text-md italic">by {username}</h4>
        </div>
      </div>
      <div className="flex flex-col items-end bg-gray-100 p-2 rounded-lg shadow-md space-y-1">
        <span className="text-xs font-medium text-gray-700">
          {totalVotes} votes
        </span>
        <span className="text-xs font-medium text-green-700">
          {score} points
        </span>
      </div>
    </div>
  );
};


export default LeaderboardItem;