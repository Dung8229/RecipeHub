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
    <tr className="hover:bg-gray-100">
      <td className="p-2 border-b">{comment.id}</td>
      <td className="p-2 border-b">{comment.username}</td>
      <td className="p-2 border-b">
        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
          {comment.content}
        </div>
      </td>
      <td className="p-2 border-b">{comment.recipeName}</td>
      <td className="p-2 border-b">
        {new Date(comment.createdAt).toLocaleDateString('en-US')}
      </td>
      <td className="p-2 border-b text-center">
        <button 
          onClick={handleDelete} 
          className="text-yellow-700 hover:bg-orange-300 px-2 py-1 rounded-full font-bold"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CommentRow; 