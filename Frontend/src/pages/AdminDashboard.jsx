import Nav from "../components/competition_components/Nav"
import NavItem from "../components/competition_components/NavItem"
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminManageUsersPage from './AdminManageUsersPage'
import AdminManageCommentsPage from './AdminManageCommentsPage'
import AdminManageCompetitionsPage from './AdminManageCompetitionPage'
import AdminManageRecipePage from "./AdminManageRecipePage";

const AdminDashboardPage = () => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname); // Đặt giá trị mặc định cho activeItem
  const navigate = useNavigate()

  const handleNavItemClick = (href) => {
    setActiveItem(href) // Cập nhật activeItem khi một NavItem được nhấn
    navigate(href)
  };

  const renderActivePage = () => {
    switch (activeItem) {
      case "/admin/dashboard/users":
        return <AdminManageUsersPage />;
      case "/admin/dashboard/comments":
        return <AdminManageCommentsPage />;
      case "/admin/dashboard/recipes":
        return <AdminManageRecipePage />
      case "/admin/dashboard/competitions":
        return <AdminManageCompetitionsPage />;
      default:
        return null
    }
  }
      

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="font-bold text-slate-900 text-2xl sm:text-2xl md:text-3xl leading-tight p-6">
        Admin Dashboard
      </h1>
      <div className="divide-y divide-slate-100">
        <Nav>
          <NavItem 
            href="/admin/dashboard/users" 
            isActive={activeItem === '/admin/dashboard/users'} 
            onClick={() => handleNavItemClick('/admin/dashboard/users')}
          >
            Users
          </NavItem>
          <NavItem 
            href="/admin/dashboard/comments" 
            isActive={activeItem === "/admin/dashboard/comments"} 
            onClick={() => handleNavItemClick("/admin/dashboard/comments")}
          >
            Comments
          </NavItem> 
          <NavItem 
            href="/admin/dashboard/recipes" 
            isActive={activeItem === '/admin/dashboard/recipes'} 
            onClick={() => handleNavItemClick('/admin/dashboard/recipes')}
          >
            Recipes
          </NavItem>   
          <NavItem 
            href="/admin/dashboard/competitions" 
            isActive={activeItem === '/admin/dashboard/competitions'} 
            onClick={() => handleNavItemClick('/admin/dashboard/competitions')}
          >
            Competitions
          </NavItem>            
        </Nav>
        {renderActivePage()}
      </div>
    </div>
  )
}

export default AdminDashboardPage