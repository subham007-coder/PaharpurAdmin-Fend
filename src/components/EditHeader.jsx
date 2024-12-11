import React, { useState, useEffect } from "react";
import api from '../api/axios';

const EditHeader = () => {
  const [headerData, setHeaderData] = useState({
    logoUrl: "",
    contact: { phone: "", email: "" },
    navigationLinks: [],
  });
  const [newNavigationLink, setNewNavigationLink] = useState({
    name: "",
    url: ""
  });

  useEffect(() => {
    // Fetch the current header data to populate the form
    const fetchHeaderData = async () => {
      try {
        const response = await api.get("/api/header");
        setHeaderData(response.data);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchHeaderData();
  }, []);

  const handleLogoChange = (e) => {
    setHeaderData({ ...headerData, logoUrl: e.target.value });
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
    try {
      const response = await api.post("/api/header/update", headerData);
      console.log("Header updated:", response.data);
    } catch (error) {
      console.error("Error updating header:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Header</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo URL */}
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300">
            Logo URL
          </label>
          <input
            type="text"
            id="logoUrl"
            value={headerData.logoUrl}
            onChange={handleLogoChange}
            className="mt-1 block w-full px-4 bg-gray-600 py-2 border border-gray-300 rounded-md"
            placeholder="Enter Logo URL"
          />
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Phone</label>
          <input
            type="text"
            value={headerData.contact.phone}
            onChange={handlePhoneChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-600 border border-gray-300 rounded-md"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={headerData.contact.email}
            onChange={handleEmailChange}
            className="mt-1 block w-full px-4 py-2 border bg-gray-600 border-gray-300 rounded-md"
            placeholder="Enter email"
          />
        </div>

        {/* Navigation Links */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Navigation Links</label>
          <div className="space-y-2">
            {headerData.navigationLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                <div>
                  <span className="mr-2">{link.name}</span>
                  <span className="text-gray-400">({link.url})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updatedLinks = headerData.navigationLinks.filter(
                      (_, i) => i !== index
                    );
                    setHeaderData({ ...headerData, navigationLinks: updatedLinks });
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          {/* New Navigation Link Inputs */}
          <div className="mt-2 space-y-2">
            <input
              type="text"
              name="name"
              value={newNavigationLink.name}
              onChange={handleNavigationLinkChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-600 border border-gray-300 rounded-md"
              placeholder="Link Name (e.g., Home)"
            />
            <input
              type="text"
              name="url"
              value={newNavigationLink.url}
              onChange={handleNavigationLinkChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-600 border border-gray-300 rounded-md"
              placeholder="Link URL (e.g., /home)"
            />
            <button
              type="button"
              onClick={handleAddNavigationLink}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Link
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Update Header
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHeader;
