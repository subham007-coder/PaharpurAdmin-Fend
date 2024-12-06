import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAccounts = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Configure axios defaults
        axios.defaults.withCredentials = true;
        
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('https://paharpur-backend-adminpanel.onrender.com/api/auth/admins', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                // Log the response to see the data structure
                console.log('Admin Response:', response.data);

                // Check if response.data.admins exists, otherwise use response.data
                const adminData = response.data.admins || response.data;
                
                // Ensure adminData is an array and has required fields
                if (Array.isArray(adminData)) {
                    // Map and validate each admin object
                    const validatedAdmins = adminData.map(admin => ({
                        _id: admin._id || 'N/A',
                        name: admin.name || 'No Name',
                        email: admin.email || 'No Email',
                        role: admin.role || 'Admin'
                    }));
                    setAdmins(validatedAdmins);
                    console.log('Validated Admins:', validatedAdmins);
                } else {
                    console.error('Admin data is not an array:', adminData);
                    setAdmins([]);
                }
                setError(null);
            } catch (error) {
                console.error('Error fetching admins:', error);
                if (error.response?.status === 401) {
                    setError('Please login to view admin accounts');
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
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4">
                {error}
            </div>
        );
    }

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
                                    <span className="font-semibold">Name:</span> {admin.name || 'No Name'}
                                </p>
                                <p className="text-white">
                                    <span className="font-semibold">Email:</span> {admin.email || 'No Email'}
                                </p>
                                <p className="text-white">
                                    <span className="font-semibold">Role:</span> {admin.role || 'Admin'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAccounts; 