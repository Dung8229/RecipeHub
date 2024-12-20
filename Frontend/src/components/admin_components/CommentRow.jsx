import React from 'react';
import commentService from '../../services/comments';

const CommentRow = ({ comment, setComments }) => {
  const handleDelete = async () => {
    try {
      const confirmation = window.confirm('Are you sure you want to delete this comment?');
      if (!confirmation) return;

      await commentService.deleteComment(comment.id);
      setComments(prevComments => prevComments.filter(c => c.id !== comment.id));
      alert('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Unable to delete comment');
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">{comment.id}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{comment.username}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
          {comment.content}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{comment.recipeName}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {new Date(comment.createdAt).toLocaleDateString('en-US')}
      </td>
      <td className="px-6 py-4 text-center">
        <button 
          onClick={handleDelete} 
          className="text-orange-500 hover:text-orange-700 font-medium bg-orange-50 px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CommentRow; 