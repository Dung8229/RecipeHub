import React from 'react';
import Navbar from './components/Navbar';
import UserList from './components/UserList';

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
