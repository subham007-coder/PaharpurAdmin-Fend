import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalEdit = ({ onClose, onSave }) => {
  const [initiatives, setInitiatives] = useState([]);
  const [initiativeId, setInitiativeId] = useState("");
  const [initiative, setInitiative] = useState({
    title: "",
    subtitle: "",
    location: "",
    tagline: "",
    description: "",
    mainImage: "",
    gallery: [],
  });
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch all initiatives from the backend
    const fetchInitiatives = async () => {
      try {
        const response = await axios.get("http://147.79.66.243:5000/api/initiatives");
        setInitiatives(response.data);
        console.log("Fetched initiatives:", response.data); // Log the fetched data
      } catch (err) {
        setError("Failed to load initiatives");
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  useEffect(() => {
    if (!initiativeId || initiatives.length === 0) return;

    // Find the initiative by initiativeId
    const initiativeToEdit = initiatives.find(
      (initiative) => initiative._id === initiativeId
    );

    if (initiativeToEdit) {
      setInitiative(initiativeToEdit);
    }
  }, [initiativeId, initiatives]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitiative({ ...initiative, [name]: value });
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImage) {
      setInitiative((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage],
      }));
      setNewGalleryImage("");
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setInitiative((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initiativeId) {
      setError("Invalid initiative ID");
      return;
    }

    try {
      await axios.put(
        `http://147.79.66.243:5000/api/initiatives/${initiativeId}`,
        initiative
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Reset success message after 3 seconds
      onSave(); // Callback to refresh the parent component
    } catch (err) {
      setError("Failed to save initiative data");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-10">
      <div className="w-[90%] mx-auto bg-gray-100 text-black p-6 rounded">
        <h2 className="text-lg font-bold mb-4">Edit Initiative</h2>
        
        {/* Dropdown for selecting initiative */}
        <div className="mb-4">
          <label htmlFor="initiativeSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select Initiative
          </label>
          <select
            id="initiativeSelect"
            value={initiativeId}
            onChange={(e) => setInitiativeId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">Select an initiative</option>
            {initiatives.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {initiativeId && (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={initiative.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-4">
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={initiative.subtitle}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={initiative.location}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Tagline */}
            <div className="mb-4">
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={initiative.tagline}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={initiative.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                rows="4"
              />
            </div>

            {/* Main Image */}
            <div className="mb-4">
              <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <input
                type="text"
                name="mainImage"
                value={initiative.mainImage}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Gallery */}
            <div className="mb-4">
              <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-2">
                Gallery
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Add new gallery image URL"
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {initiative.gallery.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Gallery ${index}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>

            {success && (
              <p className="mt-3 text-green-500">Initiative updated successfully!</p>
            )}
            {error && <p className="mt-3 text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
};

export default ModalEdit;
