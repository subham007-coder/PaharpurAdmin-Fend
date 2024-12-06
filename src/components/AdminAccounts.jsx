import React, { useState, useEffect } from 'react';

const AdminAccounts = () => {
    const [admins, setAdmins] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch('https://paharpur-backend-adminpanel.onrender.com/api/auth/admins', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch admins');
                }
        
                const data = await response.json();
                return data;
        
            } catch (error) {
                console.error('Error fetching admins:', error);
                throw error;
            }
        };

        fetchAdmins();
    }, []);

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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Admin Accounts</h2>
            
            {/* Current User Details */}
            <div className="mb-8 bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Your Account</h3>
                {currentUser && (
                    <div className="space-y-2">
                        <p className="text-white"><span className="font-semibold">Username:</span> {currentUser.username}</p>
                        <p className="text-white"><span className="font-semibold">Email:</span> {currentUser.email}</p>
                        <p className="text-white"><span className="font-semibold">Role:</span> {currentUser.role}</p>
                    </div>
                )}
            </div>

            {/* Other Admins List */}
            <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Other Admins</h3>
                <div className="grid gap-4">
                    {admins
                        .filter(admin => admin._id !== currentUser?._id)
                        .map(admin => (
                            <div 
                                key={admin._id} 
                                className="bg-slate-700 p-4 rounded-lg"
                            >
                                <p className="text-white"><span className="font-semibold">Username:</span> {admin.username}</p>
                                <p className="text-white"><span className="font-semibold">Role:</span> {admin.role}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminAccounts; 