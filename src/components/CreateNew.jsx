import React, { useState } from "react";
import axios from "axios";
import uploadToCloudinary from '../utils/cloudinaryUpload';

const CreateNew = ({ onSave, onClose }) => {
  // State to manage form fields
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

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

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setInitiative({
        ...initiative,
        mainImage: URL.createObjectURL(file)
      });
    }
  };

  const handleGalleryImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const newGalleryPreviews = files.map(file => URL.createObjectURL(file));
    
    setGalleryFiles(prev => [...prev, ...files]);
    setInitiative(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...newGalleryPreviews]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let mainImageUrl = initiative.mainImage;
      if (mainImageFile) {
        mainImageUrl = await uploadToCloudinary(mainImageFile);
      }

      const galleryUrls = [];
      for (const file of galleryFiles) {
        const url = await uploadToCloudinary(file);
        galleryUrls.push(url);
      }

      const initiativeData = {
        ...initiative,
        mainImage: mainImageUrl,
        gallery: galleryUrls
      };

      await axios.post("https://api.adsu.shop/api/initiatives", initiativeData);
      setSuccess(true);
      onSave();
    } catch (err) {
      setError("Failed to create new initiative");
    }
  };

  return (
    <section className="py-10">
      <div className="w-[90%] mx-auto bg-gray-100 text-black p-6 rounded">
        <h2 className="text-lg font-bold mb-4">Create New Initiative</h2>

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
              required
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
            <label className="block text-sm font-medium mb-2">Main Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full px-3 py-2 border rounded"
            />
            {initiative.mainImage && (
              <img 
                src={initiative.mainImage} 
                alt="Main Preview" 
                className="mt-2 max-w-full h-40 object-cover rounded"
              />
            )}
          </div>

          {/* Gallery */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Gallery Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImageChange}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="grid grid-cols-3 gap-4 mt-2">
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
              Create Initiative
            </button>
          </div>

          {success && (
            <p className="mt-3 text-green-500">Initiative created successfully!</p>
          )}
          {error && <p className="mt-3 text-red-500">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default CreateNew;
