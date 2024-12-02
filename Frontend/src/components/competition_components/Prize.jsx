const Prize = ({ prize }) => {
  if (!prize) {
    return null; // Không hiển thị gì nếu không có giá trị giải thưởng
  }

  return (
    <div className="bg-green-500 my-8 font-handwriting p-6 rounded-lg shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-2xl">
      <p className="text-6xl font-bold text-white mt-2 animate-bounce">
        {prize.toLocaleString("en-US", { style: "currency", currency: "USD" })} reward for first place submission!
      </p>
    </div>
  );
};

export default Prize;