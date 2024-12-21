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
    <div className="p-6">
      {/* Search bar */}
      <div className="mb-6">
        <div className="flex border rounded-lg overflow-hidden border-black w-full max-w-md bg-orange-50">
          <input
            type="text"
            placeholder="Search comments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full text-gray-500 focus:outline-none bg-orange-50"
          />
          <button className="bg-primary px-4 py-2">
            <FontAwesomeIcon icon={faSearch} className="text-white" />
          </button>
        </div>
      </div>

      {/* Comments table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Content</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Recipe</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created At</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comments.map(comment => (
              <CommentRow key={comment.id} comment={comment} setComments={setComments} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* Hiển thị số trang */}
        {totalPages > 5 ? (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-full ${currentPage === 1 ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-full ${currentPage === 2 ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
            >
              2
            </button>
            {currentPage > 3 && <span className="flex items-center">...</span>}
            {currentPage > 2 && currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(currentPage)}
                className={`w-8 h-8 rounded-full bg-orange-100 text-orange-500`}
              >
                {currentPage}
              </button>
            )}
            {currentPage < totalPages - 2 && <span className="flex items-center">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              className={`w-8 h-8 rounded-full ${currentPage === totalPages - 1 ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
            >
              {totalPages - 1}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-8 h-8 rounded-full ${currentPage === totalPages ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
            >
              {totalPages}
            </button>
          </>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-8 h-8 rounded-full ${currentPage === number ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
            >
              {number}
            </button>
          ))
        )}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div> 
      
    </div>
  );
};

export default CommentList; 