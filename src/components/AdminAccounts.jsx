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
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    'http://localhost:5000/api/auth/admins',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data && response.data.success) {
                    const adminArray = response.data.admins || [];
                    if (Array.isArray(adminArray)) {
                        setAdmins(adminArray);
                    } else {
                        console.error('Admins data is not an array:', adminArray);
                        setAdmins([]);
                    }
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    setError('Failed to fetch admin accounts. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg m-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Admin Accounts</h2>
            {admins.length === 0 ? (
                <p className="text-white">No admin accounts found.</p>
            ) : (
                <div className="grid gap-4">
                    {admins.map((admin) => (
                        <div key={admin._id || Math.random()} className="bg-slate-800 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white">
                                        <span className="font-semibold">Username:</span> {admin.username || 'N/A'}
                                    </p>
                                    {currentUser._id === admin._id && (
                                        <p className="text-white">
                                            <span className="font-semibold">Email:</span> {admin.email || 'N/A'}
                                        </p>
                                    )}
                                    <p className="text-white">
                                        <span className="font-semibold">Role:</span> {admin.role || 'N/A'}
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
            )}
        </div>
    );
};

export default AdminAccounts; 