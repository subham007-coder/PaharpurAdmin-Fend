import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios'; // Import the configured api instance
import Modal from 'react-modal'; // Import a modal library

const EnquiryList = () => {
    const { theme } = useTheme();
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedEnquiry, setSelectedEnquiry] = useState(null); // New state for selected enquiry

    const fetchEnquiries = async () => {
        try {
            const response = await api.get('/api/enquiries');
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

    useEffect(() => {
        fetchEnquiries();
    }, [navigate]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/api/enquiries/${id}/status`, { status: newStatus });
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
                await api.delete(`/api/enquiries/${id}`);
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

    const openDetailsModal = (enquiry) => {
        setSelectedEnquiry(enquiry); // Set the selected enquiry
    };

    const closeDetailsModal = () => {
        setSelectedEnquiry(null); // Clear the selected enquiry
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
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Enquiries</h2>
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
                                    <span className="font-semibold">subject:</span> {enquiry.subject}
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
                                <button
                                    onClick={() => openDetailsModal(enquiry)} // Add button for more details
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                >
                                    More Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for displaying enquiry details */}
            <Modal
                isOpen={!!selectedEnquiry}
                onRequestClose={closeDetailsModal}
                className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-2xl font-bold mb-4">Enquiry Details</h2>
                {selectedEnquiry && (
                    <div className="space-y-4">
                        <p className="text-lg"><strong>Name:</strong> <span className="text-gray-700">{selectedEnquiry.name}</span></p>
                        <p className="text-lg"><strong>Email:</strong> <span className="text-gray-700">{selectedEnquiry.email}</span></p>
                        <p className="text-lg"><strong>Phone:</strong> <span className="text-gray-700">{selectedEnquiry.phone}</span></p>
                        <p className="text-lg"><strong>Subject:</strong> <span className="text-gray-700">{selectedEnquiry.subject}</span></p>
                        <p className="text-lg"><strong>Message:</strong> <span className="text-gray-700">{selectedEnquiry.message}</span></p>
                        <p className="text-lg"><strong>Status:</strong> <span className="text-gray-700">{selectedEnquiry.status}</span></p>
                        <p className="text-lg"><strong>Created At:</strong> <span className="text-gray-700">{new Date(selectedEnquiry.createdAt).toLocaleString()}</span></p>
                    </div>
                )}
                <button onClick={closeDetailsModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default EnquiryList; 