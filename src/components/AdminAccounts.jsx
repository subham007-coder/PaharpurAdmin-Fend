import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAccounts = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                // Get user data from localStorage
                const userData = localStorage.getItem('user');
                if (!userData) {
                    navigate('/login');
                    return;
                }

                const currentUser = JSON.parse(userData);
                const token = localStorage.getItem('token');

                const response = await axios.get(
                    'https://paharpur-backend-adminpanel.onrender.com/api/auth/admins',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data) {
                    setAdmins(response.data);
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
                if (error.response?.status === 401) {
                    localStorage.clear(); // Clear storage on auth error
                    navigate('/login');
                } else {
                    setError('Failed to fetch admin accounts');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [navigate]);

    if (loading) {
        return <div className="text-white text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Admin Accounts</h2>
            <div className="grid gap-4">
                {admins.map((admin) => (
                    <div key={admin._id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white">
                                    <span className="font-semibold">Username:</span> {admin.username}
                                </p>
                                {/* Show email only for the current user */}
                                {currentUser._id === admin._id && (
                                    <p className="text-white">
                                        <span className="font-semibold">Email:</span> {admin.email}
                                    </p>
                                )}
                                <p className="text-white">
                                    <span className="font-semibold">Role:</span> {admin.role}
                                </p>
                                {currentUser._id === admin._id && (
                                    <p className="text-green-500 mt-2 text-sm">
                                        (Current User)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAccounts; 