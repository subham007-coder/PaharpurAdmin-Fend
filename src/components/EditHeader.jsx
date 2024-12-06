import React, { useState, useEffect } from "react";
import axios from "axios";

const EditHeader = () => {
  const [headerData, setHeaderData] = useState({
    logoUrl: "",
    contact: { phone: "", email: "" },
    navigationLinks: [],
  });
  const [newNavigationLink, setNewNavigationLink] = useState("");

  useEffect(() => {
    // Fetch the current header data to populate the form
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get("https://paharpur-backend-adminpanel.onrender.com/api/header");
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
    setNewNavigationLink(e.target.value);
  };

  const handleAddNavigationLink = () => {
    setHeaderData({
      ...headerData,
      navigationLinks: [...headerData.navigationLinks, newNavigationLink],
    });
    setNewNavigationLink(""); // Reset the input field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://paharpur-backend-adminpanel.onrender.com/api/header/update", headerData);
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
              <div key={index} className="flex items-center justify-between">
                <span>{link}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedLinks = headerData.navigationLinks.filter(
                      (item) => item !== link
                    );
                    setHeaderData({ ...headerData, navigationLinks: updatedLinks });
                  }}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newNavigationLink}
            onChange={handleNavigationLinkChange}
            className="mt-1 block w-full px-4 py-2 text-black border-gray-200 rounded-md"
            placeholder="Add new navigation link"
          />
          <button
            type="button"
            onClick={handleAddNavigationLink}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Link
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Update Header
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHeader;
