import React from 'react';
import Navbar from '../components/admin_components/Navbar';
import CommentList from '../components/admin_components/CommentList';

function AdminManageCommentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <CommentList />
      </main>
    </div>
  );
}

export default AdminManageCommentsPage;
