import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaEdit, FaBanner, FaTextHeight, FaPlus, FaCog, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

const NavBar = () => {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();

    // Handle logout
    const handleLogout = async () => {
        try {
            console.log('Logging out...');

            // Make the API call to logout
            const response = await fetch('https://api.adsu.shop/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) {
                console.log('Logout API response:', data);
                // Clear localStorage
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                localStorage.removeItem('token'); // Remove token as well
                localStorage.clear();

                // Update authentication state
                setIsAuthenticated(false);

                // Navigate to login page
                console.log('Redirecting to login...');
                navigate('/login', { replace: true });
            } else {
                console.error('Logout API error:', data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Clear localStorage and navigate even if there's an error
            localStorage.clear();
            navigate('/login', { replace: true });
        }
    };

    // Check if the route is active for styling
    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <div className={`flex flex-col w-64 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        } shadow-md`}>
            <div className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <h1 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Admin Panel</h1>
            </div>
            <ul className="flex flex-col p-4 space-y-2">
                <li>
                    <Link
                        to="/admin-accounts"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/admin-accounts') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaUser className="mr-2" /> Admin Accounts
                    </Link>
                </li>
                <li>
                    <Link
                        to="/edit-header"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/edit-header') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaEdit className="mr-2" /> Edit Header
                    </Link>
                </li>
                <li>
                    <Link
                        to="/banner-edit"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/banner-edit') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaBanner className="mr-2" /> Banner Edit
                    </Link>
                </li>
                <li>
                    <Link
                        to="/hero-text-edit"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/hero-text-edit') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaTextHeight className="mr-2" /> Hero Text
                    </Link>
                </li>
                <li>
                    <Link
                        to="/create-new"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/create-new') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaPlus className="mr-2" /> Create New Initiative
                    </Link>
                </li>
                <li>
                    <Link
                        to="/edit-modal"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/edit-modal') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaCog className="mr-2" /> Edit Modal
                    </Link>
                </li>
                <li>
                    <Link
                        to="/edit-footer"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/edit-footer') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaEdit className="mr-2" /> Edit Footer
                    </Link>
                </li>
                <li>
                    <Link
                        to="/enquiries"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/enquiries') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                    >
                        <FaEnvelope className="mr-2" /> Enquiries
                    </Link>
                </li>
                <li className="mt-auto pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-2 rounded text-red-500 hover:bg-gray-700 hover:text-red-400"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default NavBar;
