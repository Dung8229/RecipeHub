// Danh sách người dùng, search bar và các nút pagination để di chuyển giữa các trang.

import React, { useState, useEffect } from 'react';
import UserRow from './UserRow';
import { getUsers } from '../../services/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Search bar */}
      <div className="flex items-center mb-4 relative">
        <FontAwesomeIcon icon={faSearch} size="lg" className="text-gray-700 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search users"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-12 bg-yellow-100"
        />
      </div>

      {/* Table hiển thị danh sách người dùng */}
      <table className="w-full text-left bg-yellow-50">
        <thead>
          <tr>
            <th className="p-2 border-b">UserID</th>
            <th className="p-2 border-b">Username</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Role</th>
            <th className="p-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user.id} user={user} setUsers={setUsers} />
          ))}
        </tbody>
      </table>

      {/* Pagination này hơi lỗi, cần sửa */}
      <div className="flex justify-center mt-4 space-x-4">
        <button className="p-2 bg-gray-200 rounded-full">1</button>
        <button className="p-2 bg-gray-200 rounded-full">2</button>
        <button className="p-2 bg-gray-200 rounded-full">3</button>
      </div>
    </div>
  );
};

export default UserList;
