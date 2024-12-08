import React, { useState } from "react";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";

const AddEventPage = ({ token, role }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const vendorId = localStorage.getItem("vendorId"); // Assuming vendorId is stored in localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Vendor ID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null); // Clear previous messages

      const payload = {
        ...formData,
        vendorId,
      };

      const response = await axios.post("http://localhost:8080/api/v1/events/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Event added successfully!");
      setFormData({
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to add the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Add Event</h2>

        {message && (
          <div
            className={`p-4 mb-4 ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } border border-gray-300 rounded-md`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the event title"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the event description"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(AddEventPage, ["VENDOR"]);
