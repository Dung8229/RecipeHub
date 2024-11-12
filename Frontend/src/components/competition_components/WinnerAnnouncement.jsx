const WinnerAnnouncement = ({ username, profilePic, recipeTitle, recipeImage, totalVotes, score }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-lg w-full max-w-6xl mx-auto mb-6 h-96 p-4">
      <h2 className="text-4xl font-bold text-center mt-6 mb-0 text-gray-800">
        Congratulate to our winner!
      </h2>
      <div className="grid grid-cols-3 gap-10 place-content-center rounded-lg mb-6 w-full p-4">
        
        {/* Cột 1: Ảnh người dùng và tên người dùng (dịch sang phải) */}
        <div className="flex flex-col items-center justify-center">
          <img 
            src={profilePic} 
            alt={`${username}'s profile`} 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-2"
          />
          <h2 className="text-3xl font-bold text-gray-800">{username}</h2>
        </div>

        {/* Cột 2: Ảnh món ăn và tên món ăn (căn giữa) */}
        <div className="flex flex-col items-center justify-center">
          <img 
            src={recipeImage} 
            alt={`${recipeTitle}`} 
            className="max-w-64 max-h-40 rounded-lg object-cover border-4 border-white shadow-lg mb-2"
          />
          <h3 className="text-2xl text-center font-semibold text-gray-700">{recipeTitle}</h3>
        </div>

        {/* Cột 3: Votes và Score (căn dưới cạnh trái) */}
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl text-gray-800">
            <span className="font-semibold">Votes:</span> {totalVotes}
          </div>
          <div className="text-xl text-gray-800 mt-2">
            <span className="font-semibold">Score:</span> {score}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnerAnnouncement