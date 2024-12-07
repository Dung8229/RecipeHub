import React from 'react';
import competitionService from '../../services/competitions'
import { Link } from 'react-router-dom';

const AdminCompetitionListItem = ({ competition, removeCompetition }) => {
  const handleDelete = async (competitionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this competition?");
  
    if (!confirmDelete) {
      return; // Hủy bỏ nếu người dùng chọn "Cancel"
    }

    try {
      await competitionService.deleteCompetition(competitionId); // Gọi API xóa trên server
      
      removeCompetition(competitionId); // Cập nhật state để xóa khỏi giao diện
      alert('Competition deleted successfully!');
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('Failed to delete competition.');
    }
  };

  return (
    <div className="relative group">
      {/* Toàn bộ article là một link */}
      <Link
        to={`/admin/dashboard/competitions/${competition.id}/information`}
        className="block p-4 bg-yellow-50 border rounded-md hover:border-primary transition-all duration-300"
      >
        <article className="flex items-center">
          {/* Hình ảnh */}
          <img
            src={competition.image}
            alt={`${competition.title} thumbnail`}
            className="w-20 h-20 rounded-md object-cover flex-none"
          />
          
          {/* Phần thông tin bên phải ảnh */}
          <div className="flex-1 pl-4">
            <h2 className="text-lg font-semibold text-slate-900">{competition.title}</h2>
            <p className="text-sm text-slate-500">
              {competition.endDate ? `Ends on ${new Date(competition.endDate).toLocaleDateString()}` : 'No end date'}
            </p>
          </div>
        </article>
      </Link>

      {/* Nút "Delete" */}
      <button
        onClick={() => handleDelete(competition.id)}
        className="absolute top-4 right-4 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
      >
        Delete
      </button>
    </div>
  );
};

export default AdminCompetitionListItem;