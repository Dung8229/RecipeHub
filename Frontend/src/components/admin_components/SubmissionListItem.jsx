const SubmissionListItem = ({ submission }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
      <img src={submission.image} alt={submission.recipeTitle} className="w-40 h-40 object-cover rounded-md" />
      <h3 className="text-xl font-semibold">{submission.recipeTitle}</h3>
      <p className="text-sm text-gray-500">By {submission.username}</p>
      <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
        Remove
      </button>
    </div>
  );
};

export default SubmissionListItem