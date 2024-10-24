import React, { useState } from 'react';
import NavItem from './NavItem';

const Nav = ({ children }) => {
  const [activeItem, setActiveItem] = useState('/competitions/open'); // Đặt giá trị mặc định cho activeItem

  const handleNavItemClick = (href) => {
    setActiveItem(href); // Cập nhật activeItem khi một NavItem được nhấn
  };

  return (
    <nav className="pt-4 px-6 text-sm font-medium">
      <ul className="flex space-x-3">
        {children}
      </ul>
    </nav>
  )
}

export default Nav