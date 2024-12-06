import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAccounts = () => {
    const [admins, setAdmins] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                'https://paharpur-backend-adminpanel.onrender.com/api/auth/current-user',
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                }
            );

            if (response.data.success) {
                return response.data.user;
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                // First fetch the current logged-in user
                const currentUserData = await fetchCurrentUser();
                setCurrentUser(currentUserData);

                // Then fetch all admins
                const adminsResponse = await axios.get(
                    'https://paharpur-backend-adminpanel.onrender.com/api/auth/admins',
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                const adminData = adminsResponse.data.admins || adminsResponse.data;
                
                if (Array.isArray(adminData)) {
                    setAdmins(adminData);
                } else {
                    console.error('Admin data is not an array:', adminData);
                    setAdmins([]);
                }
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401 || error.message === 'No token found') {
                    setError('Please login to view admin accounts');
                    navigate('/login');
                } else {
                    setError('Failed to fetch admin accounts');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <div className="flex justify-center items-center h-full"><div className="text-white">Loading...</div></div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!admins || admins.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Admin Accounts</h2>
                <p className="text-white">No admin accounts found.</p>
            </div>
        );
    }

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
                                {/* Only show email for the current logged-in user */}
                                {currentUser && currentUser._id === admin._id && (
                                    <p className="text-white">
                                        <span className="font-semibold">Email:</span> {admin.email}
                                    </p>
                                )}
                                <p className="text-white">
                                    <span className="font-semibold">Role:</span> {admin.role}
                                </p>
                                {/* Indicate if this is the current user */}
                                {currentUser && currentUser._id === admin._id && (
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