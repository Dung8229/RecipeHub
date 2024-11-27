import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import competitionService from '../../services/competitions';

const WinnerList = ({ competitionId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard } = await competitionService.getLeaderboard(competitionId);
        const maxScore = leaderboard[0]?.score || 0;
        const topEntries = leaderboard.filter(entry => entry.score === maxScore);
        setLeaderboard(topEntries);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaderboard();
  }, [competitionId]);

  const moveEntry = (dragIndex, hoverIndex) => {
    const updatedLeaderboard = [...leaderboard];
    const [removed] = updatedLeaderboard.splice(dragIndex, 1);
    updatedLeaderboard.splice(hoverIndex, 0, removed);
    setLeaderboard(updatedLeaderboard);
  };

  const saveOrder = async () => {
    try {
      const updatedRanks = leaderboard.map((entry, index) => ({
        entryId: entry.id,
        tieBreakerRank: index + 1,
      }));

      await competitionService.updateTieBreakerRanks(competitionId, updatedRanks);
      alert('Updated tie-breaker ranks successfully.');
    } catch (error) {
      console.error('Failed to update tie-breaker ranks:', error);
      alert('Failed to update tie-breaker ranks. Please try again.');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="winner-list">
        {leaderboard.length === 0 ? (
          <div>No top scorers found.</div>
        ) : (
          leaderboard.map((entry, index) => (
            <DraggableEntry
              key={entry.id}
              entry={entry}
              index={index}
              moveEntry={moveEntry}
            />
          ))
        )}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600"
          onClick={saveOrder}
        >
          Save Order
        </button>
      </div>
    </DndProvider>
  );
};

const DraggableEntry = ({ entry, index, moveEntry }) => {
  const [, ref] = useDrag({
    type: 'entry',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'entry',
    hover: (item) => {
      if (item.index !== index) {
        moveEntry(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
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
    </div>
  );
};

export default WinnerList;