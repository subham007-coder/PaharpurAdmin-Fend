import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuthenticated'));
    const navigate = useNavigate();
    const location = useLocation();

    // Handle logout
    const handleLogout = async () => {
        try {
            console.log('Logging out...');

            // Make the API call to logout
            const response = await fetch('http://147.79.66.243:5000/api/auth/logout', {
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
        <div className="flex flex-col w-64 bg-slate-900 text-white shadow-md">
            <div className="p-4 border-b">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <ul className="flex flex-col p-4 space-y-2">
                <li>
                    <Link
                        to="/admin-accounts"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/admin-accounts') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Admin Accounts
                    </Link>
                </li>
                <li>
                    <Link
                        to="/edit-header"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/edit-header') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Edit Header
                    </Link>
                </li>
                <li>
                    <Link
                        to="/banner-edit"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/banner-edit') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Banner Edit
                    </Link>
                </li>
                <li>
                    <Link
                        to="/Hero-Text-edit"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/Hero-Text-edit') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Hero Text
                    </Link>
                </li>
                <li>
                    <Link
                        to="/create-new"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/create-new') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Create New Initiative
                    </Link>
                </li>
                <li>
                    <Link
                        to="/Edit-modal"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/Edit-modal') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Edit Modal
                    </Link>
                </li>
                <li>
                    <Link
                        to="/edit-footer"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/edit-footer') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Edit Footer
                    </Link>
                </li>
                <li>
                    <Link
                        to="/enquiries"
                        className={`flex items-center p-2 rounded ${isActiveRoute('/enquiries') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                    >
                        Enquiries
                    </Link>
                </li>
                <li className="mt-auto pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-2 rounded text-red-500 hover:bg-gray-700 hover:text-red-400"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default NavBar;
