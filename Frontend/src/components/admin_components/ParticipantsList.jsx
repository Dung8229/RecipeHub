import React, { useState, useEffect } from 'react';
import competitionService from '../../services/competitions'
import ParticipantListItem from './ParticipantListItem';
import Pagination from './Pagination';

const ParticipantsList = ({ competitionId }) => {
  const [participants, setParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { participants, totalPages } = await competitionService.getParticipants(
          competitionId,
          currentPage
        );
        setParticipants(participants);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [competitionId, currentPage]);

  const handleRemove = async (userId) => {
    const confirmation = window.confirm('Are you sure you want to remove this user from this competition?');
    if (!confirmation) return;
  
    try {
      await competitionService.deleteParticipant(competitionId, userId);
      alert('User removed!');
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.userId !== userId)
      );
    } catch (error) {
      console.error('Error removing participant:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-center">Participants List</h2>
      {participants.length === 0 ? (
        <p className="text-center text-gray-500">There's no participants.</p>
      ) : (
        <>
          <ul>
            {participants.map((participant) => (
              <ParticipantListItem
                key={participant.userId}
                participant={participant}
                handleRemove={handleRemove}
              />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ParticipantsList