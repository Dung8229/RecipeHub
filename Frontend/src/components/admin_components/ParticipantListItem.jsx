const ParticipantListItem = ({ participant, handleRemove }) => {
  const { username, recipeTitle } = participant;

  return (
    <li className="flex items-center justify-between bg-yellow-50 p-4 border rounded-md shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
        <p className="text-sm text-gray-500">
          {recipeTitle ? `Submission: ${recipeTitle}` : 'No submission yet'}
        </p>
      </div>
      <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleRemove(participant.userId)}
          >
            Remove
          </button>
      </div>
    </li>
  );
};

export default ParticipantListItem;
