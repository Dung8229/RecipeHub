import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <h1 className="text-lg font-semibold">RecipeHub</h1>
      <div className="flex items-center space-x-5">
        <a href="#" className="text-gray-700 hover:underline">Users</a>
        <a href="#" className="text-gray-700 hover:underline">Recipes</a>
        <a href="#" className="text-gray-700 hover:underline">Comments</a>
        <a href="#" className="text-gray-700 hover:underline">Contests</a>
        <button className="bg-gray-100 p-2 rounded-full hover:bg-orange-300">
          <span className="sr-only">Notifications</span>
          <FontAwesomeIcon icon={faBell} size="lg" className="text-gray-700" />
        </button>
        {/* Ảnh Admin */}
        <img src="https://i.pinimg.com/236x/46/22/59/46225951d3e23497bf932f77f072383a.jpg" alt="Admin Image" className="w-10 h-10 rounded-full" />
        <button className="text-gray-600 hover:underline">Log out</button>
      </div>
    </nav>
  );
};

export default Navbar;
