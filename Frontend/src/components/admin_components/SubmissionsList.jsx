import React, { useState, useEffect } from 'react';
import competitionService from '../../services/competitions'
import SubmissionListItem from './SubmissionListItem';
import Pagination from './Pagination';

const SubmissionsList = ({ competitionId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { submissions, totalPages } = await competitionService.getSubmissions(competitionId, currentPage, 8);
        setSubmissions(submissions);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [competitionId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRemove = async (submissionId) => {
    const confirmation = window.confirm('Are you sure you want to remove this submission from this competition?');
    if (!confirmation) return;
  
    try {
      await competitionService.deleteSubmission(competitionId, submissionId);
      alert('Submission removed!');
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((s) => s.submissionId !== submissionId)
      );
    } catch (error) {
      console.error('Error removing submission:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submission List</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {submissions.map((submission) => (
          <SubmissionListItem key={submission.submissionId} submission={submission} handleRemove={handleRemove} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default SubmissionsList