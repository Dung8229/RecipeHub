import Nav from "../components/competition_components/Nav"
import NavItem from "../components/competition_components/NavItem"
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import competitionService from '../services/competitions'
import AdminManageCompetitionForm from "../components/admin_components/AdminManageCompetitionForm";
import ParticipantsList from "../components/admin_components/ParticipantsList";
import SubmissionsList from "../components/admin_components/SubmissionsList";
import WinnerList from "../components/admin_components/WinnerList"
import AnnouncedWinner from "../components/admin_components/AnnouncedWinner";

const AdminManageACompetitionPage = () => {
  const [activeItem, setActiveItem] = useState(location.pathname);
  const { id } = useParams(); // Lấy id từ URL
  const [competitionData, setcompetitionData] = useState("")
  const navigate = useNavigate();
  const now = new Date()

  useEffect(() => {
    const fetchCompetitionData = async () => {
      try {
        const response = await competitionService.getDetail(id); // Gọi API với id
        setcompetitionData(response);
        console.log('response:', response)
      } catch (error) {
        console.error("Error fetching competition details:", error);
      }
    };

    fetchCompetitionData();
  }, [id])

  const handleNavItemClick = (href) => {
    setActiveItem(href); // Cập nhật activeItem
    navigate(href); // Điều hướng
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="font-bold text-slate-900 text-2xl sm:text-2xl md:text-3xl leading-tight p-6">
        { competitionData.title }
      </h1>
      <div className="divide-y divide-slate-100">
        <Nav>
          <NavItem
            href={`/admin/competitions/${id}/information`} 
            isActive={activeItem === `/admin/competitions/${id}/information`} 
            onClick={() => handleNavItemClick(`/admin/competitions/${id}/information`)}
          >
            Manage Competition
          </NavItem>
          <NavItem
            href={`/admin/competitions/${id}/winner`} 
            isActive={activeItem === `/admin/competitions/${id}/winner`} 
            onClick={() => handleNavItemClick(`/admin/competitions/${id}/winner`)}
          >
            Announce Winner
          </NavItem>
        </Nav>
        
        {activeItem === `/admin/competitions/${id}/information` && (
          <div>
            <AdminManageCompetitionForm id={id} />
            <ParticipantsList competitionId={id} />
            <SubmissionsList competitionId={id} />
          </div>
        )}
        {activeItem === `/admin/competitions/${id}/winner` && (
          <div>
            {now < new Date(competitionData.winnerSelectionStartDate) ? (
              // Chưa đến ngày chọn winner
              <div className="text-gray-600 text-center">
                Winner selection is not available yet. Please wait until {new Date(competitionData.winnerSelectionStartDate).toLocaleDateString()}.
              </div>
            ) : now > new Date(competitionData.endDate) ? (
              // Sau ngày kết thúc competition
              <AnnouncedWinner competitionId={id} />
            ) : (
              // Đến ngày chọn winner
              <WinnerList competitionId={id} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageACompetitionPage