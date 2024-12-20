import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import tokenService from '../services/token'

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lấy search term từ URL khi component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const userLoginData = await tokenService.getUserInfo();
          console.log('User Login:', userLoginData);
          if (!userLoginData.id) {
            setIsLoggedIn(false)
          } else {
            setIsLoggedIn(true);
            setUser(userLoginData);
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };

  fetchUserData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { isLogin: true } });
  };

  const handleRegisterClick = () => {
    navigate('/register', { state: { isLogin: false } });
  };

  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    window.localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    // Chuyển hướng về trang login
    navigate('/login', { state: { isLogin: true } });
  };

  return (
    <header className="bg-white shadow-md py-4 fixed top-0 left-0 w-full z-50">
      {/* Phần trên với Logo, Search Bar và Log In */}
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
        
        {/* Logo */}
        <div className="font-handwriting text-3xl md:text-8xl text-orange-400 transition-transform transform hover:scale-110 hover:text-orange-600">
          Recipehub
        </div>

        {/* Search Bar */}
        <div className="flex border rounded-lg overflow-hidden border-black">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find a recipe or ingredient" 
            className="px-4 py-2 w-full md:w-80 text-gray-500 focus:outline-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
          <button 
            onClick={handleSearch}
            className="bg-primary hover:bg-primaryHover rounded-r-lg px-2 py-2 w-10"
          >
            <FontAwesomeIcon icon={faSearch} className="text-white"/>
          </button>
        </div>

        {/* Log In/Register hoặc Logout Button */}
        <div className="flex items-center ml-2 space-x-2">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span 
                onClick={() => navigate('/profile')} 
                className="cursor-pointer text-sm text-gray-600 hover:text-primaryHover">
                {user?.username || 'User'}
              </span>
              <div 
                onClick={() => navigate('/profile')} 
                className="cursor-pointer hover:text-primaryHover"
              >
                <img 
                  src={user?.image || '/anonymous-avatar.png'} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
              </div>
              <button 
                onClick={handleLogout}
                className="cursor-pointer text-text hover:text-primaryHover text-sm"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faUser} className="text-primary"/>
              <button 
                onClick={handleLoginClick}
                className="text-text hover:text-primaryHover text-sm"
              >
                Log In
              </button>
              <p>/</p>
              <button 
                onClick={handleRegisterClick}
                className="text-text hover:text-primaryHover text-sm"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Phần dưới với Navigation, hiển thị trên màn hình lớn */}
      <nav className="container mx-auto max-w-full mt-4 hidden md:flex justify-center space-x-10">
        <Link to="/home" className="text-lg hover:text-primaryHover">Home</Link>
        <Link to="/recipes/search" className="text-lg hover:text-primaryHover">Search For A Recipe</Link>
        <Link to="/competitions/open" className="text-lg hover:text-primaryHover">Competitions</Link>
        <Link to="/recipes/create" className="text-lg hover:text-primaryHover">Create A Recipe</Link>
        <Link to="/shopping-list" className="text-lg hover:text-primaryHover">Shopping List</Link>
        {user && user.role === "admin" ? 
        <Link to="/admin/dashboard/users" className="text-lg hover:text-primaryHover">Admin Dashboard</Link>
        : null}
      </nav>
    </header>
  );
};

export default Header;
