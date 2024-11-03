import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 fixed top-0 left-0 w-full z-50">
      {/* Phần trên với Logo, Search Bar và Log In */}
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
        
        {/* Logo */}
        <div className="logo max-w-fit text-4xl md:text-6xl text-orange-500">
          Recipehub
        </div>

        {/* Search Bar */}
        <div className="flex border rounded-lg overflow-hidden border-black">
          <input 
              type="text" 
              placeholder="Find a recipe or ingredient" 
              className="px-4 py-2 w-full md:w-80 text-gray-500 focus:outline-none"
          />
          <button className="bg-primary hover:bg-primaryHover rounded-r-lg px-2 py-2 w-10">
            <FontAwesomeIcon icon={faSearch} className="text-white"/>
          </button>
        </div>

        {/* Log In Button */}
        <div className="flex items-center ml-2 space-x-2">
          <FontAwesomeIcon icon={faUser} className="text-primary"/>
          <button className="text-text hover:text-primaryHover text-sm">Log In</button>
        </div>
      </div>

      {/* Phần dưới với Navigation, hiển thị trên màn hình lớn */}
      <nav className="container mx-auto max-w-full mt-4 hidden md:flex justify-center space-x-10">
        <a href="#" className="text-lg hover:text-primaryHover">Home</a>
        <a href="#" className="text-lg hover:text-primaryHover">Dinner</a>
        <a href="#" className="text-lg hover:text-primaryHover">Vegetarian</a>
        <a href="#" className="text-lg hover:text-primaryHover">Contests</a>
        <a href="#" className="text-lg hover:text-primaryHover">Shopping List</a>
        <a href="#" className="text-lg hover:text-primaryHover">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
