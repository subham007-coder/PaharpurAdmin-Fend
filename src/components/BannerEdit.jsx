import React, { useState, useEffect } from "react";
import axios from "axios";

const BannerEdit = () => {
  const [bannerData, setBannerData] = useState(null);
  const [newBanner, setNewBanner] = useState({ imageUrl: "", overlayText: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch banner data
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get("https://api.adsu.shop/api/banner");
        setBannerData(response.data);
        setNewBanner(response.data); // Pre-fill form with existing data
      } catch (err) {
        console.error(err);
        setBannerData(null); // No banner found
      } finally {
        setLoading(false);
      }
    };
    fetchBannerData();
  }, []);

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state while submitting
    try {
      if (bannerData) {
        // Update existing banner
        const response = await axios.put("https://api.adsu.shop/api/banner", newBanner);
        setBannerData(response.data);
      } else {
        // Add a new banner
        const response = await axios.post("https://api.adsu.shop/api/banner/create", newBanner);
        setBannerData(response.data);
      }
      setSuccess("Banner saved successfully!");
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save the banner.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBanner({ ...newBanner, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Simulating file upload
      setNewBanner({ ...newBanner, imageUrl });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white text-black shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{bannerData ? "Edit Banner" : "Add New Banner"}</h2>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Current Banner Preview */}
        {bannerData && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Current Banner:</label>
            <img src={bannerData.imageUrl} alt="Current Banner" className="w-full rounded" />
          </div>
        )}

        {/* Upload New Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Enter Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={newBanner.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Overlay Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Overlay Text:</label>
          <input
            type="text"
            name="overlayText"
            value={newBanner.overlayText}
            onChange={handleChange}
            placeholder="Enter overlay text"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded"
          disabled={loading} // Disable button while loading
        >
          {bannerData ? "Save Changes" : "Add Banner"}
        </button>
      </form>
    </div>
  );
};

export default BannerEdit;