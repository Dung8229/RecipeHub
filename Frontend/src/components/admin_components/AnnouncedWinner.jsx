import React, { useEffect, useState } from "react";
import competitionService from "../../services/competitions"; // Đảm bảo file service có hàm getLeaderboard

const AnnouncedWinner = ({ competitionId }) => {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const { winner } = await competitionService.getLeaderboard(competitionId);
        setWinner(winner);
      } catch (err) {
        console.error("Failed to fetch winner:", err);
      }
    };

    fetchWinner();
  }, [competitionId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="text-gray-600 text-center">
                The competition has ended. Winner has already been selected or cannot be modified.
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">Competition Winner</h2>
      {winner ? (
        <div className="flex flex-col items-center">
          <img
            src={winner.userImage}
            alt={winner.username}
            className="w-24 h-24 rounded-full mb-4"
          />
          <p className="text-lg font-semibold">{winner.username}</p>
          <p className="text-gray-600 text-sm">Winning Recipe: {winner.recipeTitle}</p>
          <img
            src={winner.recipeImage}
            alt={winner.recipeTitle}
            className="w-32 h-32 object-cover rounded-lg mt-4"
          />
          <div className="mt-4">
            <p className="text-gray-700">Total Votes: {winner.totalVotes}</p>
            <p className="text-gray-700">Score: {winner.score}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No winner data available.</div>
      )}
    </div>
  );
};

export default AnnouncedWinner;