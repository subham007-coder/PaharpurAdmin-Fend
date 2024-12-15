import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast
import api from '../api/axios';
import ConfirmationModal from './ConfirmationModal'; // Import the modal
import Modal from 'react-modal'; // Import a modal library

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for details modal
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const fetchEnquiries = async () => {
        setLoading(true); // Set loading state
        try {
            const response = await api.get('/api/enquiries');
            if (response.data.success) {
                setEnquiries(response.data.enquiries);
                setError(null);
                toast.success('Enquiries loaded successfully!'); // Show success toast
            } else {
                toast.error('Failed to load enquiries.'); // Show error toast
            }
        } catch (error) {
            setError('Failed to fetch enquiries. Please try again later.');
            toast.error('Failed to fetch enquiries. Please try again later.'); // Show error toast
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        fetchEnquiries(); // Fetch enquiries on component mount
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await api.put(`/api/enquiries/${id}/status`, { status: newStatus });
            
            // Check if the response indicates success
            if (response.data.success) {
                toast.success('Status updated successfully!'); // Show success toast
                await fetchEnquiries(); // Refresh the enquiries list
            } else {
                // If the response indicates failure, show an error toast
                toast.error('Failed to update status. Please try again.'); // Show error toast
            }
        } catch (error) {
            console.error('Error updating status:', error);
            if (error.response?.status === 401) {
                setError('Please login to update status');
                toast.error('Please login to update status'); // Show error toast
                navigate('/login');
            } else {
                toast.error('Failed to update status. Please try again.'); // Show error toast
            }
        }
    };

    const handleDelete = async (id) => {
        console.log('Attempting to delete enquiry with ID:', id); // Debugging line
        if (!id) {
            toast.error('No enquiry selected for deletion.'); // Show error toast if no ID is provided
            return;
        }
        
        try {
            await api.delete(`/api/enquiries/${id}`); // Use the ID passed to the function
            setEnquiries(enquiries.filter(enquiry => enquiry._id !== id)); // Update the state
            toast.success('Enquiry deleted successfully!'); // Show success toast
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            toast.error('Failed to delete enquiry. Please try again.'); // Show error toast
        } finally {
            setIsModalOpen(false); // Close the modal
        }
    };

    const openDetailsModal = (enquiry) => {
        setSelectedEnquiry(enquiry); // Set the selected enquiry for details
        setIsDetailsModalOpen(true); // Open the details modal
    };

    const openDeleteModal = (enquiry) => {
        setSelectedEnquiry(enquiry); // Set the selected enquiry for deletion
        setIsModalOpen(true); // Open the delete confirmation modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEnquiry(null);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedEnquiry(null);
    };

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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Enquiries</h2>
            {enquiries.length === 0 ? (
                <p>No enquiries found.</p>
            ) : (
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
                                        <span className="font-semibold">Subject:</span> {enquiry.subject}
                                    </p>
                                    {/* Status Badge */}
                                    <div className=''>
                                        <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                                            enquiry.status === 'completed' ? 'bg-green-500' :
                                            enquiry.status === 'inProgress' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}>
                                            {enquiry.status}
                                        </div>
                                        {/* Status Dropdown */}
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                                            className="bg-slate-700 text-white border border-slate-600 rounded p-2 mt-4"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => openDeleteModal(enquiry)} // Open delete confirmation modal
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => openDetailsModal(enquiry)} // Open details modal
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        More Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={() => handleDelete(selectedEnquiry?._id)} // Pass the ID of the selected enquiry
                enquiryName={selectedEnquiry?.name} // Pass the enquiry name for display
            />

            {/* Enquiry Details Modal */}
            {isDetailsModalOpen && (
                <Modal
                    isOpen={isDetailsModalOpen}
                    onRequestClose={closeDetailsModal}
                    className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto overflow-y-auto max-h-[400px] mt-4"
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
            )}
        </div>
    );
};

export default EnquiryList; 