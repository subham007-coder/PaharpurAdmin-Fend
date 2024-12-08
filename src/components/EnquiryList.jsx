import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Configure axios defaults
        axios.defaults.withCredentials = true;
        
        const fetchEnquiries = async () => {
            try {
                const response = await axios.get('https://api.adsu.shop/api/enquiries', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                setEnquiries(response.data.enquiries);
                setError(null);
            } catch (error) {
                console.error('Error:', error);
                if (error.response?.status === 401) {
                    setError('Please login to view enquiries');
                    navigate('/login');
                } else {
                    setError('Failed to fetch enquiries');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, [navigate]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(
                `https://api.adsu.shop/api/enquiries/${id}/status`,
                { status: newStatus },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchEnquiries();
        } catch (error) {
            console.error('Error updating status:', error);
            if (error.response?.status === 401) {
                setError('Please login to update status');
                navigate('/login');
            } else {
                alert('Failed to update status');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await axios.delete(
                    `https://api.adsu.shop/api/enquiries/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                fetchEnquiries();
            } catch (error) {
                console.error('Error deleting enquiry:', error);
                if (error.response?.status === 401) {
                    setError('Please login to delete enquiries');
                    navigate('/login');
                } else {
                    alert('Failed to delete enquiry');
                }
            }
        }
    };

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
            <h2 className="text-2xl font-bold mb-6 text-white">Enquiries</h2>
            <div className="grid gap-4">
                {enquiries.map((enquiry) => (
                    <div key={enquiry._id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white">
                                    <span className="font-semibold">Name:</span> {enquiry.name}
                                </p>
                                <p className="text-white">
                                    <span className="font-semibold">Email:</span> {enquiry.email}
                                </p>
                                <p className="text-white">
                                    <span className="font-semibold">Message:</span> {enquiry.message}
                                </p>
                                <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                                    enquiry.status === 'completed' ? 'bg-green-500' :
                                    enquiry.status === 'inProgress' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}>
                                    {enquiry.status}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <select
                                    value={enquiry.status}
                                    onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                                    className="bg-slate-700 text-white border border-slate-600 rounded p-2"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="inProgress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button
                                    onClick={() => handleDelete(enquiry._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnquiryList; 