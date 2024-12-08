import React, { useState, useEffect } from "react";
import axios from "axios";

const HeroTextEdit = () => {
  const [heroText, setHeroText] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch existing hero text and description from the backend
    const fetchHeroText = async () => {
      try {
        const response = await axios.get("https://api.adsu.shop/api/hero-text");
        setHeroText(response.data.heroText);
        setHeroDescription(response.data.heroDescription);
        setLoading(false);
      } catch (err) {
        setError("Failed to load hero text data");
        setLoading(false);
      }
    };

    fetchHeroText();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("https://api.adsu.shop/api/hero-text", {
        heroText,
        heroDescription,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Reset success message after 3 seconds
    } catch (err) {
      setError("Failed to save hero text data");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-10">
      <div className="w-[90%] mx-auto bg-gray-100 text-black p-6 rounded">
        <h2 className="text-lg font-bold mb-4">Edit Hero Text Section</h2>
        <form onSubmit={handleSubmit}>
          {/* Hero Text Input */}
          <div className="mb-4">
            <label htmlFor="heroText" className="block text-sm font-medium text-gray-700 mb-2">
              Hero Text
            </label>
            <textarea
              id="heroText"
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Hero Description Input */}
          <div className="mb-4">
            <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Hero Description
            </label>
            <textarea
              id="heroDescription"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="5"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          {success && <p className="mt-3 text-green-500">Hero text updated successfully!</p>}
        </form>
      </div>
    </section>
  );
};

export default HeroTextEdit;
