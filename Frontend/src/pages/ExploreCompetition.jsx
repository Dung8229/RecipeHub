import Nav from "../components/competition_components/Nav"
import NavItem from "../components/competition_components/NavItem"
import List from "../components/competition_components/List"
import ListItemCompetition from "../components/competition_components/ListItemCompetition"
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import competitionService from '../services/competitions'

const ExploreCompetitionPage = () => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname); // Đặt giá trị mặc định cho activeItem
  const [openComps, setOpenComps] = useState([]); // State để lưu danh sách open competitions
  const [closedComps, setClosedComps] = useState([]); // State để lưu danh sách closed competitions
  const navigate = useNavigate()

  // Hàm để lấy tất cả các cuộc thi
  const fetchCompetitions = async () => {
    try {
      // Phân loại cuộc thi thành open và closed
      const dataOpen = await competitionService.getAll("open"); // Chờ kết quả từ API
      setOpenComps(dataOpen); // Thiết lập state cho open competitions
      console.log('Fetched open competitions:', dataOpen); // Log giá trị open competitions
  
      const dataClosed = await competitionService.getAll("closed"); // Lọc closed competitions
      setClosedComps(dataClosed); // Thiết lập state cho closed competitions
      console.log('Fetched closed competitions:', dataClosed); // Log giá trị closed competitions
    } catch (err) {
      console.log('Failed to fetch competitions:', err.message); // Cập nhật lỗi nếu có
    }
  };

  const handleNavItemClick = (href) => {
    setActiveItem(href) // Cập nhật activeItem khi một NavItem được nhấn
    navigate(href)
  };

  useEffect(() => {
    fetchCompetitions(); // Gọi hàm khi component được mount
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-bold text-slate-900 text-2xl sm:text-2xl md:text-3xl leading-tight p-6">
        Competitions
      </h1>
      <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 px-6">
        Put your skills to the test and compete against other home cooks
      </p>
      <div className="divide-y divide-slate-100">
        <Nav>
          <NavItem 
            href="/competitions/open" 
            isActive={activeItem === '/competitions/open'} 
            onClick={() => handleNavItemClick('/competitions/open')}
          >
            Open
          </NavItem>
          <NavItem 
            href="/competitions/closed" 
            isActive={activeItem === '/competitions/closed'} 
            onClick={() => handleNavItemClick('/competitions/closed')}
          >
            Closed
          </NavItem>          
        </Nav>
        <List>
          {(activeItem === '/competitions/open' ? openComps : closedComps).map((competition) => (
            <ListItemCompetition key={competition.id} competition={competition} />
          ))}
        </List>
      </div>
    </div>
  )
}

export default ExploreCompetitionPage