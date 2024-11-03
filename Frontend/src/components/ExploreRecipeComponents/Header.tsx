import React from 'react';

const Header: React.FC = () => (
  <header className="w-full px-10 py-3 border-b border-[#e5e8ea] flex justify-between items-center">
    <nav className="flex items-center gap-8">
      <div className="text-[#ff8c00] text-5xl font-bold font-['Qwitcher Grypen']">Recipehub</div>
      <a href="#" className="text-sm font-medium">Home</a>
      <a href="#" className="text-sm font-medium">Create Recipes</a>
      <a href="#" className="text-sm font-medium">Contests</a>
      <a href="#" className="text-sm font-medium">Shop</a>
    </nav>
    <div className="flex items-center gap-4">
      <button className="w-10 h-10 bg-[#f4efef] rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
      <button className="w-10 h-10 bg-[#f4efef] rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      </button>
      <img src="https://via.placeholder.com/40x40" alt="User" className="w-10 h-10 rounded-full" />
    </div>
  </header>
);

export default Header;
