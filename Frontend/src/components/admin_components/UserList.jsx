// Danh sách người dùng, search bar và các nút pagination để di chuyển giữa các trang.

import React from 'react';
import UserRow from './UserRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu mẫu người dùng để hiển thị trong bảng.
const users = [
  { id: 1234, username: 'Cristiano Ronaldo', email: 'cr7alnasser@gmail.com', role: 'User' },
  { id: 2234, username: 'Lionel Messi', email: 'messilionelintermiami@gmail.com', role: 'User' },
  { id: 1000, username: 'Recipeshare', email: 'recipeshare@gmail.com', role: 'User' },
  { id: 3234, username: 'Pep Guardiola', email: 'guardiolamancity@gmail.com', role: 'User' },
  { id: 4234, username: 'Neymar JR', email: 'neymar10brazil@gmail.com', role: 'User' },
  { id: 5234, username: 'Eric Ten Hag', email: 'tenhagmanutd@gmail.com', role: 'User' },
  { id: 6234, username: 'Kylian Mbappe', email: 'mbappefrance@gmail.com', role: 'User' },
  { id: 7234, username: 'Erling Haaland', email: 'haalandnorway@gmail.com', role: 'User' },
];

const UserList = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4 relative">
        <FontAwesomeIcon icon={faSearch} size="lg" className="text-gray-700 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search users"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-12 bg-yellow-100"
        />
      </div>
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
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>

      {/* Cái Pagination này chưa đúng lắm, cần sửa */}
      <div className="flex justify-center mt-4 space-x-4">
        <button className="p-2 bg-gray-200 rounded-full">1</button>
        <button className="p-2 bg-gray-200 rounded-full">2</button>
        <button className="p-2 bg-gray-200 rounded-full">3</button>
      </div>
    </div>
  );
};

export default UserList;
