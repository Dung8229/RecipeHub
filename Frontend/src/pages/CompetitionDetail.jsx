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

  const fetchCompetitionDetail = async () => {
    try {
      const data = await competitionService.getDetail(id); // Gọi dịch vụ với id
      console.log("fetched data:", data)
      setCompetition(data); // Cập nhật state với dữ liệu nhận được
      console.log(competition)
    } catch (error) {
      console.error('Error fetching competition details:', error);
    }
  }

  const fetchCompetitionLeaderboard = async () => {
    try {
      const data = await competitionService.getLeaderboard(id)
      console.log("fetched data:", data)
      setLeaderboardData(data)
      console.log(leaderboardData)
    } catch (error) {
      console.error('Error fetching competition leaderboard:', error);
    }
  }

  useEffect(() => {
    fetchCompetitionDetail(); // Gọi hàm khi component được mount
    fetchCompetitionLeaderboard()
  }, [id]);

  return (
    <div className="mx-auto flex">
      <div className="flex-1 p-4">
        <Banner 
          title={competition?.title || 'No Title'} 
          image={competition?.image || 'default-image.jpg'} 
          description={competition?.description || 'No Description'} 
          detailDescription={competition?.detailDescription || 'No Detail Description'} 
        />
        <ProgressBar
          startDate={competition?.startDate || 'No start date'}
          endDate={competition?.endDate || 'No end date'}
        />
        <WinnerAnnouncement 
          username="John Doe" 
          profilePic="path/to/profile-pic.jpg" 
          recipeTitle="Best Chocolate Cake" 
          recipeImage="path/to/recipe-image.jpg" 
        />
        <Leaderboard entries={leaderboardData} />
      </div>
    </div>
  )
}

export default CompetitionDetailPage