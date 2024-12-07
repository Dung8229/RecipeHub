import prizeAwardedImage from "../../assets/prize-awarded.png";

const Prize = ({ prize, prizeGiven }) => {
  if (!prize) {
    return null; // Không hiển thị nếu không có giá trị giải thưởng
  }

  return (
    <div className="flex justify-between items-center max-w-6xl mx-auto my-8 space-x-4">
      {/* Phần thông tin giải thưởng */}
      <div className="bg-green-500 flex-grow font-handwriting p-6 rounded-lg shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-2xl">
        <p className="text-6xl font-bold text-white mt-2 animate-bounce">
          {prize.toLocaleString("en-US", { style: "currency", currency: "USD" })} reward for first place submission!
        </p>
      </div>
  
      {/* Phần hiển thị trạng thái trao thưởng */}
      {prizeGiven ? (
        <div className="flex flex-col items-center">
          <img 
            src={prizeAwardedImage} 
            alt="Prize Awarded" 
            className="w-24 h-24 mb-2 p-3 bg-primary border-4 border-double rounded-full transition-all duration-300 ease-in-out transform hover:scale-125"
          />
          <span className="text-black text-xl font-semibold">Prize Awarded!</span>
        </div>
      ) : null}
    </div>
  );  
};

export default Prize;