import React, { useState, useEffect } from 'react';
import competitionService from '../../services/competitions';

const WinnerList = ({ competitionId, onWinnerSelected }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard } = await competitionService.getLeaderboard(competitionId);
        const maxScore = leaderboard[0]?.score || 0; // Điểm cao nhất
        const topEntries = leaderboard.filter(entry => entry.score === maxScore);
        setLeaderboard(topEntries);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaderboard();
  }, [competitionId]);

  const handleSelectWinner = async (entry) => {
    try {
      // Gửi yêu cầu cập nhật Winner lên server
      await competitionService.setWinner(competitionId, entry.recipeId);

      // Gọi callback để cập nhật Winner hiển thị trên trang khác
      onWinnerSelected(entry);

      alert(`Selected ${entry.recipeTitle} as the winner.`);
    } catch (error) {
      console.error("Failed to set winner:", error);
      alert("Failed to set winner. Please try again.");
    }
  };

  return (
    <div className="winner-list">
      {leaderboard.length === 0 ? (
        <div>No top scorers found.</div>
      ) : (
        leaderboard.map(entry => (
          <div
            key={entry.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
          >
            <div className="flex items-center">
              <img
                src={entry.recipeImage}
                alt={entry.recipeTitle}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <p className="font-bold text-lg">{entry.recipeTitle}</p>
                <p className="text-gray-700">By: {entry.username}</p>
                <p className="text-sm text-gray-500">Score: {entry.score}</p>
              </div>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => handleSelectWinner(entry)}
            >
              Select as Winner
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default WinnerList;