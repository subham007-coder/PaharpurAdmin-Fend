import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa';

const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage or your auth system
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <nav className={`
       top-0 right-0 left-[250px] // Adjust left based on your sidebar width
      h-14 p-[30px]
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
      border-b border-gray-200 dark:border-gray-700
      flex items-center justify-between
      z-50
    `}>
      {/* Left side - Page title or breadcrumbs */}
      <div>
        <h1 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>Dashboard</h1>
      </div>

      {/* Right side - Theme toggle and user info */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-full
            ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
            transition-colors duration-200
          `}
        >
          {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {user?.email || 'user@example.com'}
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {user?.role || 'User Role'}
            </p>
          </div>
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
          `}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;