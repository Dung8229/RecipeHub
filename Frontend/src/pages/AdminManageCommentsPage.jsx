import React from 'react';
import Navbar from '../components/admin_components/Navbar';
import CommentList from '../components/admin_components/CommentList';

function AdminManageCommentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage comments</h1>
        <CommentList />
      </main>
    </div>
  );
}

export default AdminManageCommentsPage;
