import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/enquiries', {
                withCredentials: true
            });
            setEnquiries(response.data.enquiries);
        } catch (error) {
            setError('Failed to fetch enquiries');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/enquiries/${id}/status`, 
                { status: newStatus },
                { withCredentials: true }
            );
            fetchEnquiries();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await axios.delete(`http://localhost:5000/api/enquiries/${id}`, {
                    withCredentials: true
                });
                fetchEnquiries();
            } catch (error) {
                console.error('Error deleting enquiry:', error);
                alert('Failed to delete enquiry');
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
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Enquiries</h2>
            <div className="grid gap-4">
                {enquiries.map((enquiry) => (
                    <div key={enquiry._id} className="bg-slate-800 p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div className="text-white">
                                <h3 className="font-bold text-lg">{enquiry.subject}</h3>
                                <p className="text-gray-300">From: {enquiry.name}</p>
                                <p className="text-gray-300">Email: {enquiry.email}</p>
                                <p className="text-gray-300">Phone: {enquiry.phone}</p>
                                <p className="mt-2 text-gray-200">{enquiry.message}</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    {new Date(enquiry.createdAt).toLocaleString()}
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