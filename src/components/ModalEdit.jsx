import React, { useState, useEffect } from "react";
import axios from "axios";
import uploadToCloudinary from '../utils/cloudinaryUpload';

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

  // New state for file handling
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [newGalleryFile, setNewGalleryFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const response = await axios.get("https://api.adsu.shop/api/initiatives");
        setInitiatives(response.data);
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

  // Handle main image file change
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setInitiative({
        ...initiative,
        mainImage: URL.createObjectURL(file)
      });
    }
  };

  // Handle new gallery image file
  const handleGalleryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewGalleryFile(file);
    }
  };

  const handleAddGalleryImage = async () => {
    if (newGalleryFile) {
      setUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(newGalleryFile);
        setInitiative((prev) => ({
          ...prev,
          gallery: [...prev.gallery, imageUrl],
        }));
        setNewGalleryFile(null);
        // Reset file input
        const fileInput = document.getElementById('galleryFileInput');
        if (fileInput) fileInput.value = '';
      } catch (err) {
        setError("Failed to upload gallery image");
      } finally {
        setUploading(false);
      }
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

    setUploading(true);
    try {
      let mainImageUrl = initiative.mainImage;
      
      // Upload main image if new file is selected
      if (mainImageFile) {
        mainImageUrl = await uploadToCloudinary(mainImageFile);
      }

      const updatedInitiative = {
        ...initiative,
        mainImage: mainImageUrl,
      };

      await axios.put(
        `https://api.adsu.shop/api/initiatives/${initiativeId}`,
        updatedInitiative
      );
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSave();
    } catch (err) {
      setError("Failed to save initiative data");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!initiativeId) {
      setError("Invalid initiative ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this initiative?")) {
      return;
    }

    setUploading(true);
    try {
      await axios.delete(`https://api.adsu.shop/api/initiatives/${initiativeId}`);
      setSuccess("Initiative deleted successfully!");
      setTimeout(() => {
        onClose();
        onSave(); // To refresh the parent component
      }, 2000);
    } catch (err) {
      setError("Failed to delete initiative");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-10">
      <div className="w-[90%] mx-auto bg-gray-100 text-black p-6 rounded">
        <h2 className="text-lg font-bold mb-4">Edit Initiative</h2>
        
        {/* Initiative Selection Dropdown */}
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
            {/* Existing text fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Other text fields remain the same */}
            {/* ... */}

            {/* Main Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <div className="space-y-2">
                {initiative.mainImage && (
                  <img
                    src={initiative.mainImage}
                    alt="Main"
                    className="w-full max-h-40 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery
              </label>
              <div className="flex items-center mb-2">
                <input
                  id="galleryFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  disabled={!newGalleryFile || uploading}
                  className={`ml-2 px-4 py-2 ${
                    uploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-md`}
                >
                  {uploading ? 'Adding...' : 'Add'}
                </button>
              </div>
              
              {/* Gallery Preview */}
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

            {/* Submit, Delete and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              
              {initiativeId && ( // Only show delete button if an initiative is selected
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  {uploading ? 'Deleting...' : 'Delete'}
                </button>
              )}
              
              <button
                type="submit"
                disabled={uploading}
                className={`px-4 py-2 ${
                  uploading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
                } text-white rounded-md`}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
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
