import React, { useEffect, useState } from "react";
import competitionService from "../../services/competitions"
import userService from '../../services/users'
import emailjs from "emailjs-com";

const AnnouncedWinner = ({ competitionId }) => {
  const [winner, setWinner] = useState(null);
  const [winnerEmail, setWinnerEmail] = useState('');
  const [prizeGiven, setPrizeGiven] = useState(false)
  const [prize, setPrize] = useState(null)
  const [competitionTitle, setCompetitionTitle] = useState('')

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const { winner } = await competitionService.getLeaderboard(competitionId);
        setWinner(winner);
        const winnerData = await userService.getUserData(winner.userId)
        setWinnerEmail(winnerData.email)
        const competitionData = await competitionService.getDetail(competitionId)
        setPrizeGiven(competitionData.prizeGiven)
        setPrize(competitionData.prize)
        setCompetitionTitle(competitionData.title)
      } catch (err) {
        console.error("Failed to fetch winner:", err);
      }
    };

    fetchWinner();
  }, [competitionId]);

  // Handle sending email
  const handleSendEmail = (e) => {
    e.preventDefault()
    if (!winnerEmail) {
      alert("No email available for the winner!");
      return;
    }

    emailjs
      .send(
        "gmail_service", // Replace with your EmailJS Service ID
        "template_recipehub", // Replace with your EmailJS Template ID
        {
          // to_email: winnerEmail,
          to_email: winnerEmail,
          username: winner.username,
          prize: prize.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          competitionTitle: competitionTitle,
        },
        'ClCI5HMU1vJKpkgb9'
      )
      .then(() => alert("Email sent successfully!"))
      .catch((err) => console.error("Failed to send email:", err));
  };

  // Handle marking prize as given
  const handleMarkPrizeGiven = async () => {
    try {
      await competitionService.updatePrizeStatus(competitionId, true); // Update the prize status
      setPrizeGiven(true);
      alert("Prize marked as given!");
    } catch (err) {
      console.error("Failed to update prize status:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="text-gray-600 text-center">
                The competition has ended. Winner has already been selected or cannot be modified.
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">Competition Winner</h2>
      {winner ? (
        <div className="flex flex-col items-center">
          <img
            src={winner.userImage}
            alt={winner.username}
            className="w-24 h-24 rounded-full mb-4"
          />
          <p className="text-lg font-semibold">{winner.username}</p>
          <p className="text-gray-600 text-sm">Winning Recipe: {winner.recipeTitle}</p>
          <img
            src={winner.recipeImage}
            alt={winner.recipeTitle}
            className="w-32 h-32 object-cover rounded-lg mt-4"
          />
          <div className="mt-4">
            <p className="text-gray-700">Total Votes: {winner.totalVotes}</p>
            <p className="text-gray-700">Score: {winner.score}</p>
          </div>
          <div className="flex justify-evenly w-full">
            <button
              onClick={handleSendEmail}
              className="mt-4 w-80 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Congratulations Email
            </button>
            <button
              onClick={handleMarkPrizeGiven}
              className={`mt-4 w-80 ${prizeGiven ? "bg-gray-400" : "bg-green-500"} text-white px-4 py-2 rounded hover:bg-green-700`}
              disabled={prizeGiven}
            >
              {prizeGiven ? "Prize Already Given" : "Mark Prize as Given"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No winner data available.</div>
      )}
    </div>
  );
};

export default AnnouncedWinner;