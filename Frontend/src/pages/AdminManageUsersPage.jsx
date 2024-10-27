import React from 'react';
import Navbar from '../components/admin_components/Navbar';
import UserList from '../components/admin_components/UserList';

function AdminManageUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <UserList />
      </main>
    </div>
  );
}

export default AdminManageUsersPage;
