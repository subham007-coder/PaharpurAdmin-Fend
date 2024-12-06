import React, { useState, useEffect } from "react";
import axios from "axios";

const EditFooter = () => {
  const [footerSections, setFooterSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [newSection, setNewSection] = useState({ title: "", links: [] }); // New main section
  const [newSubitem, setNewSubitem] = useState({ name: "", url: "" }); // New subitem
  const [editingSubitem, setEditingSubitem] = useState(null); // To track which subitem is being edited
  const [editedData, setEditedData] = useState({ name: "", url: "" }); // To store edited data

  // Fetch footer sections on load
  useEffect(() => {
    fetchFooterSections();
  }, []);

  const fetchFooterSections = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/footer");
      if (Array.isArray(response.data)) {
        setFooterSections(response.data);
      } else {
        console.error("API did not return an array. Check the response format.");
        setFooterSections([]);
      }
    } catch (error) {
      console.error("Error fetching footer sections:", error);
      setFooterSections([]);
    }
  };

  // Handle adding a new section
  const handleAddSection = async () => {
    if (!newSection.title) return; // Make sure there's a title
    try {
      const response = await axios.post(
        "http://localhost:5000/api/footer",
        newSection
      );
      setFooterSections([...footerSections, response.data.footer]); // Add the new section to the list
      setNewSection({ title: "", links: [] }); // Clear the new section input
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  // Handle adding a subitem under the selected section
  const handleAddSubitem = async () => {
    if (!selectedSection || !newSubitem.name || !newSubitem.url) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/footer/${selectedSection}/subitem`,
        newSubitem
      );
      setFooterSections((prev) =>
        prev.map((section) =>
          section._id === selectedSection ? response.data.footer : section
        )
      );
      setNewSubitem({ name: "", url: "" }); // Clear the input fields
    } catch (error) {
      console.error("Error adding subitem:", error);
    }
  };

  const handleUpdateSubitem = async (subitemId) => {
    if (!selectedSection || !editedData.name || !editedData.url) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/footer/${selectedSection}/subitem/${subitemId}`,
        editedData
      );
      setFooterSections((prev) =>
        prev.map((section) =>
          section._id === selectedSection ? response.data.footer : section
        )
      );
      setEditingSubitem(null); // Reset editing state after update
      setEditedData({ name: "", url: "" }); // Clear the edited data
    } catch (error) {
      console.error("Error updating subitem:", error);
    }
  };

  const handleDeleteSubitem = async (subitemId) => {
    if (!selectedSection) return;
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/footer/${selectedSection}/subitem/${subitemId}`
      );
      setFooterSections((prev) =>
        prev.map((section) =>
          section._id === selectedSection ? response.data.footer : section
        )
      );
    } catch (error) {
      console.error("Error deleting subitem:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Footer Sections</h2>

      {/* Add New Section */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-700">Add New Section</h3>
        <div className="flex flex-col gap-4 mt-3 text-black">
          <input
            type="text"
            placeholder="Section Title"
            value={newSection.title}
            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddSection}
            className="p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Section
          </button>
        </div>
      </div>

      {/* Footer Sections */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-700">Footer Sections</h3>
        <ul className="list-none mt-3">
          {footerSections.map((section) => (
            <li
              key={section._id}
              onClick={() => setSelectedSection(section._id)}
              className={`cursor-pointer p-2 mb-2 rounded-md bg-gray-500 ${
                selectedSection === section._id ? "bg-gray-500 font-bold" : ""
              }`}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Subitem to Selected Section */}
      {selectedSection && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700">Add Subitem to {footerSections.find(section => section._id === selectedSection)?.title}</h3>
          <div className="flex flex-col gap-4 mt-3 text-black">
            <input
              type="text"
              placeholder="Name"
              value={newSubitem.name}
              onChange={(e) => setNewSubitem({ ...newSubitem, name: e.target.value })}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="URL"
              value={newSubitem.url}
              onChange={(e) => setNewSubitem({ ...newSubitem, url: e.target.value })}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSubitem}
              className="p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Subitem
            </button>
          </div>
        </div>
      )}

      {/* Subitems for Selected Section */}
      {selectedSection && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700">Subitems</h3>
          <ul className="list-none mt-3">
            {footerSections
              .find((section) => section._id === selectedSection)
              ?.links?.map((subitem) => (
                <li
                  key={subitem._id}
                  className="flex justify-between text-black items-center p-2 border-b border-gray-300"
                >
                  <span>
                    {subitem.name} - {subitem.url}
                  </span>
                  <div>
                    <button
                      onClick={() => {
                        setEditingSubitem(subitem._id); // Set subitem for editing
                        setEditedData({ name: subitem.name, url: subitem.url });
                      }}
                      className="text-blue-500 hover:underline mx-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubitem(subitem._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Subitem Edit */}
      {editingSubitem && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700">Edit Subitem</h3>
          <div className="flex flex-col gap-4 mt-3 text-black">
            <input
              type="text"
              placeholder="Name"
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="URL"
              value={editedData.url}
              onChange={(e) =>
                setEditedData({ ...editedData, url: e.target.value })
              }
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleUpdateSubitem(editingSubitem)}
              className="p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Subitem
            </button>
            <button
              onClick={() => setEditingSubitem(null)}
              className="p-2 mt-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFooter;
