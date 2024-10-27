// Hàng người dùng để hiển thị từng người dùng trong danh sách.

import React from 'react';

const UserRow = ({ user }) => {
  return (
    <tr className="hover:bg-gray-100">
      <td className="p-2 border-b">{user.id}</td>
      <td className="p-2 border-b">{user.username}</td>
      <td className="p-2 border-b text-yellow-600">{user.email}</td>
      <td className="p-2 border-b">{user.role}</td>
      <td className="p-2 border-b text-center">
        <button className="text-yellow-700 hover:bg-orange-300 px-2 py-1 rounded-full font-bold">Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
