import { useEffect, useState } from 'react'
import competitionService from '../services/competitions'
import Banner from '../components/competition_components/Banner'
import ProgressBar from '../components/competition_components/ProgressBar'
import Leaderboard from '../components/competition_components/Leaderboard'
import WinnerAnnouncement from '../components/competition_components/WinnerAnnouncement'
import Prize from '../components/competition_components/Prize'
import { useParams } from 'react-router-dom'

const CompetitionDetailPage = () => {
  const { id } = useParams()
  const [competition, setCompetition] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [winner, setWinner] = useState(null)
  const [isEntryExisted, setIsEntryExisted] = useState(null)
  const [submissionId, setSubmissionId] = useState(null)
  const [isCompetitionOver, setIsCompOver] = useState(false)

  const fetchCompetitionDetail = async () => {
    try {
      const data = await competitionService.getDetail(id) // Gọi dịch vụ với id
      setCompetition(data); // Cập nhật state với dữ liệu nhận được
      // console.log('Prize given:', competition.prizeGiven)
      setIsCompOver(new Date(data.endDate) < new Date());
    } catch (error) {
      console.error('Error fetching competition details:', error);
    }
  }

  const fetchCompetitionLeaderboard = async () => {
    try {
      const leaderboardData = await competitionService.getLeaderboard(id)
      setLeaderboardData(leaderboardData.leaderboard)
      console.log('Leaderboard Data:', leaderboardData.leaderboard)
      setWinner(leaderboardData.winner)
      console.log('Winner: ', leaderboardData.winner)
    } catch (error) {
      console.error('Error fetching competition leaderboard:', error);
    }
  }

  const fetchEntryData = async () => {
    const entryData = await competitionService.getEntryDetail(id)
    if (!entryData.isEntrySubmitted) {
      setIsEntryExisted(false)
    } else {
      setIsEntryExisted(true)
      setSubmissionId(entryData.submissionId)
      console.log("This runs")
    }
  }

  useEffect(() => {
    fetchCompetitionDetail(); // Gọi hàm khi component được mount
    fetchEntryData()
    fetchCompetitionLeaderboard()
  }, [id]);

  return (
    <div className="mx-auto flex">
      <div className="flex-1">
        <Banner 
          competitionId={id}
          title={competition?.title || 'No Title'} 
          image={competition?.image || 'default-image.jpg'} 
          description={competition?.description || 'No Description'} 
          detailDescription={competition?.detailDescription || 'No Detail Description'}
          startDate={competition?.startDate || 'No start date'}
          endDate={competition?.endDate || 'No end date'} 
          winnerSelectionDate={competition?.winnerSelectionStartDate || 'No selcetion date'}
          isEntryExisted={isEntryExisted}
          submissionId={submissionId}
        />
        <ProgressBar
          startDate={competition?.startDate || 'No start date'}
          endDate={competition?.endDate || 'No end date'}
          winnerSelectionStart={competition?.winnerSelectionStartDate || 'No selection date'}
        />
        {isCompetitionOver && winner ? (
        <WinnerAnnouncement
          username={winner.username}
          profilePic={winner.userImage}
          recipeId={winner.recipeId}
          recipeTitle={winner.recipeTitle}
          recipeImage={winner.recipeImage}
          totalVotes={winner.totalVotes}
          score={winner.score}
        />
        ) : null}
        <Prize 
          prize={competition?.prize || 'No prize'} 
          prizeGiven={competition?.prizeGiven ?? 'No prize given'}
        />
        <Leaderboard entries={leaderboardData} />
      </div>
    </div>
  )
}

export default CompetitionDetailPage