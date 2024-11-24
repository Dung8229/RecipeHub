import Nav from "../components/competition_components/Nav"
import NavItem from "../components/competition_components/NavItem"
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import competitionService from '../services/competitions'
import AdminManageCompetitionForm from "../components/admin_components/AdminManageCompetitionForm";
import ParticipantsList from "../components/admin_components/ParticipantsList";
import SubmissionsList from "../components/admin_components/SubmissionsList";
import WinnerList from "../components/admin_components/WinnerList"

const AdminManageACompetitionPage = () => {
  const [activeItem, setActiveItem] = useState(location.pathname);
  const { id } = useParams(); // Lấy id từ URL
  const [title, setTitle] = useState("")
  const [winner, setWinner] = useState(null); // Thêm state winner
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetitionTitle = async () => {
      try {
        const competition = await competitionService.getDetail(id); // Gọi API với id
        setTitle(competition.title);
        setWinner(competition.winner);
      } catch (error) {
        console.error("Error fetching competition details:", error);
      }
    };

    fetchCompetitionTitle();
  }, [id])

  const handleNavItemClick = (href) => {
    setActiveItem(href); // Cập nhật activeItem
    navigate(href); // Điều hướng
  };

  const handleWinnerSelected = (selectedWinner) => {
    setWinner(selectedWinner); // Cập nhật winner khi chọn
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="font-bold text-slate-900 text-2xl sm:text-2xl md:text-3xl leading-tight p-6">
        { title }
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
            <WinnerList competitionId={id} onWinnerSelected={handleWinnerSelected} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageACompetitionPage