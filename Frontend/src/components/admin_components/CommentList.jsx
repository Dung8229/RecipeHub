import React, { useState, useEffect } from 'react';
import CommentRow from './CommentRow';
import commentService from '../../services/comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getComments(currentPage, searchTerm);
        setComments(data.comments);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [currentPage, searchTerm]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Search bar */}
      <div className="flex items-center mb-4 relative">
        <FontAwesomeIcon icon={faSearch} size="lg" className="text-gray-700 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search comments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-12 bg-yellow-100"
        />
      </div>

      {/* Comments table */}
      <table className="w-full text-left bg-yellow-50">
        <thead>
          <tr>
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">User</th>
            <th className="p-2 border-b">Content</th>
            <th className="p-2 border-b">Recipe</th>
            <th className="p-2 border-b">Created At</th>
            <th className="p-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <CommentRow key={comment.id} comment={comment} setComments={setComments} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CommentList; 