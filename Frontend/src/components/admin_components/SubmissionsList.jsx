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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submission List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <SubmissionListItem key={submission.submissionId} submission={submission} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};


export default SubmissionsList