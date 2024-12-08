import React from 'react';
import UserList from '../components/admin_components/UserList';

function AdminManageUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <UserList />
      </main>
    </div>
  );
}

export default AdminManageUsersPage;
