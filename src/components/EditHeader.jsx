import React, { useState, useEffect } from "react";
import api from '../api/axios';
import uploadToCloudinary from '../utils/cloudinaryUpload';
import { useTheme } from '../context/ThemeContext';

const EditHeader = () => {
  const { theme } = useTheme();
  const [headerData, setHeaderData] = useState({
    logoUrl: "",
    contact: { phone: "", email: "" },
    navigationLinks: [],
  });
  const [newNavigationLink, setNewNavigationLink] = useState({
    name: "",
    url: ""
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch the current header data to populate the form
    const fetchHeaderData = async () => {
      try {
        const response = await api.get("/api/header");
        setHeaderData(response.data);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setError("Failed to load header data");
      }
    };
    fetchHeaderData();
  }, []);

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Show preview
      setHeaderData({ 
        ...headerData, 
        logoUrl: URL.createObjectURL(file) 
      });
    }
  };

  const handlePhoneChange = (e) => {
    setHeaderData({
      ...headerData,
      contact: { ...headerData.contact, phone: e.target.value },
    });
  };

  const handleEmailChange = (e) => {
    setHeaderData({
      ...headerData,
      contact: { ...headerData.contact, email: e.target.value },
    });
  };

  const handleNavigationLinkChange = (e) => {
    const { name, value } = e.target;
    setNewNavigationLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNavigationLink = () => {
    if (newNavigationLink.name.trim() !== "" && newNavigationLink.url.trim() !== "") {
      setHeaderData({
        ...headerData,
        navigationLinks: [...headerData.navigationLinks, newNavigationLink],
      });
      setNewNavigationLink({ name: "", url: "" }); // Reset the input fields
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let logoUrl = headerData.logoUrl;
      
      // Upload new logo if file is selected
      if (logoFile) {
        // Get the secure_url from Cloudinary
        logoUrl = await uploadToCloudinary(logoFile);
      }

      const updatedHeaderData = {
        logoUrl,
        contact: headerData.contact,
        navigationLinks: headerData.navigationLinks.map(link => ({
          name: link.name,
          url: link.url
        }))
      };

      const response = await api.post("/api/header/update", updatedHeaderData);
      setSuccess("Header updated successfully!");
      setHeaderData(response.data);
      
      // Reset file input
      setLogoFile(null);
    } catch (error) {
      console.error("Error updating header:", error);
      setError(error.response?.data?.message || "Failed to update header");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-4">Edit Header</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            {headerData.logoUrl && (
              <img 
                src={headerData.logoUrl} 
                alt="Logo Preview" 
                className="h-20 w-auto object-contain"
              />
            )}
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-600 file:text-white
                  hover:file:bg-gray-700"
              />
              <p className="text-xs text-gray-400">
                Recommended size: 200x50 pixels
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-300" style={{ color: theme === 'dark' ? 'white' : 'black' }}>Phone</label>
          <input
            type="text"
            value={headerData.contact.phone}
            onChange={handlePhoneChange}
            className={`mt-1 block w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} border border-gray-300 rounded-md`}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300" style={{ color: theme === 'dark' ? 'white' : 'black' }}>Email</label>
          <input
            type="email"
            value={headerData.contact.email}
            onChange={handleEmailChange}
            className={`mt-1 block w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} border border-gray-300 rounded-md`}
            placeholder="Enter email"
          />
        </div>

        {/* Navigation Links */}
        <div>
          <label className="block text-sm font-medium text-gray-300" style={{ color: theme === 'dark' ? 'white' : 'black' }}>Navigation Links</label>
          <div className="space-y-2">
            {headerData.navigationLinks.map((link, index) => (
              <div key={index} className={`flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-2 rounded`}>
                <div>
                  <span className="mr-2">{link.name}</span>
                  <span className={`text-gray-400 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>({link.url})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updatedLinks = headerData.navigationLinks.filter((_, i) => i !== index);
                    setHeaderData({ ...headerData, navigationLinks: updatedLinks });
                  }}
                  className={`text-red-500 hover:text-red-600 ${theme === 'dark' ? 'text-red-600' : 'text-red-500'}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-2 space-y-2">
            <input
              type="text"
              name="name"
              value={newNavigationLink.name}
              onChange={handleNavigationLinkChange}
              className={`mt-1 block w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} border border-gray-300 rounded-md`}
              placeholder="Link Name (e.g., Home)"
            />
            <input
              type="text"
              name="url"
              value={newNavigationLink.url}
              onChange={handleNavigationLinkChange}
              className={`mt-1 block w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} border border-gray-300 rounded-md`}
              placeholder="Link URL (e.g., /home)"
            />
            <button
              type="button"
              onClick={handleAddNavigationLink}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Add Link
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Header'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHeader;