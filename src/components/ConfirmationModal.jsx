import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, enquiryName }) => {
    if (!isOpen) return null;

    console.log('Enquiry Name:', enquiryName); // Debugging line

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-900 p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete the enquiry from <strong>{enquiryName}</strong>?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 