// Hàng người dùng để hiển thị từng người dùng trong danh sách.

import React from 'react';
import { deleteUser } from '../../services/users';

const UserRow = ({ user, setUsers }) => {
  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="p-2 border-b">{user.id}</td>
      <td className="p-2 border-b">{user.username}</td>
      <td className="p-2 border-b text-yellow-600">{user.email}</td>
      <td className="p-2 border-b">{user.role}</td>
      <td className="p-2 border-b text-center">
        <button onClick={handleDelete} className="text-yellow-700 hover:bg-orange-300 px-2 py-1 rounded-full font-bold">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
