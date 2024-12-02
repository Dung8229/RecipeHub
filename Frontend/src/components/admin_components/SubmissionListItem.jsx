import { Link } from 'react-router-dom';

const SubmissionListItem = ({ submission, handleRemove }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between h-full">
      <div className="flex flex-col items-center">
        <Link to={`/recipes/${submission.submissionId}/information`} className="w-full text-center">
          <img src={submission.image} alt={submission.recipeTitle} className="w-40 h-40 object-cover rounded-md mx-auto" />
          <h3 className="text-xl font-semibold">{submission.recipeTitle}</h3>
          <p className="text-sm text-gray-500">By {submission.username}</p>
        </Link>
      </div>
      <button 
        className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={() => handleRemove(submission.submissionId)}
      >
        Remove
      </button>
    </div>
  );
};

export default SubmissionListItem