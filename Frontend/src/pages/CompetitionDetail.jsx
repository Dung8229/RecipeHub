import { useEffect, useState } from 'react'
import competitionService from '../services/competitions'
import Banner from '../components/competition_components/Banner'
import ProgressBar from '../components/competition_components/ProgressBar'
import Leaderboard from '../components/competition_components/Leaderboard'
import WinnerAnnouncement from '../components/competition_components/WinnerAnnouncement'
import { useParams } from 'react-router-dom'

const CompetitionDetailPage = () => {
  const { id } = useParams()
  const [competition, setCompetition] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [winner, setWinner] = useState(null)
  const [isCompetitionOver, setIsCompOver] = useState(false)

  const fetchCompetitionDetail = async () => {
    try {
      const data = await competitionService.getDetail(id) // Gọi dịch vụ với id
      setCompetition(data); // Cập nhật state với dữ liệu nhận được
      console.log('Competition data:', data)
      setIsCompOver(new Date(data.endDate) < new Date());
    } catch (error) {
      console.error('Error fetching competition details:', error);
    }
  }

  const fetchCompetitionLeaderboard = async () => {
    try {
      const data = await competitionService.getLeaderboard(id)
      setLeaderboardData(data.leaderboard)
      setWinner(data.winner)
    } catch (error) {
      console.error('Error fetching competition leaderboard:', error);
    }
  }

  const fetchCompetitionWinner = async () => {
    try {
      const data = await competitionService.getWinner(id)
    } catch (error) {
      console.error('No winner set yet:', error);
    }
  }

  useEffect(() => {
    fetchCompetitionDetail(); // Gọi hàm khi component được mount
    fetchCompetitionLeaderboard()
    fetchCompetitionWinner()
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
        />
        <ProgressBar
          startDate={competition?.startDate || 'No start date'}
          endDate={competition?.endDate || 'No end date'}
        />
        {isCompetitionOver && winner ? (
        <WinnerAnnouncement
          username={winner.username}
          profilePic={winner.userImage}
          recipeTitle={winner.recipeTitle}
          recipeImage={winner.recipeImage}
          totalVotes={winner.totalVotes}
          score={winner.score}
        />
        ) : null}
        <Leaderboard entries={leaderboardData} />
      </div>
    </div>
  )
}

export default CompetitionDetailPage