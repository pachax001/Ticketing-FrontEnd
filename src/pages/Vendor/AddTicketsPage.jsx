import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";

const AddTicketsPage = ({ token, role }) => {
  const [eventDetails, setEventDetails] = useState(null); // State for selected event details
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams(); // To access the query parameter

  const vendorId = localStorage.getItem("vendorId"); // Retrieve vendorId from localStorage
  const eventId = searchParams.get("eventId"); // Retrieve eventId from query parameter

  useEffect(() => {
    if (!eventId) {
      setMessage("Event ID is missing. Please go back and select an event.");
      return;
    }

    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/vendor/${vendorId}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const event = response.data.find((e) => e.eventId === eventId);
        setEventDetails(event || null);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setMessage("Failed to load event details. Please try again later.");
      }
    };

    fetchEventDetails();
  }, [token, vendorId, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price) {
      alert("Please enter a ticket price.");
      return;
    }

    if (!count || count <= 0) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null); // Clear previous messages

      const payload = {
        vendorId,
        eventId,
        price,
        count: Number(count), // Ensure count is a number
      };

      const response = await axios.post("http://localhost:8080/api/v1/tickets/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Tickets added successfully!");
      setPrice("");
      setCount(""); // Clear the form
    } catch (error) {
      console.error("Error adding tickets:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to add tickets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Add Tickets to Your Event</h2>

        {message && (
          <div
            className={`p-4 mb-4 ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } border border-gray-300 rounded-md`}
          >
            {message}
          </div>
        )}

        {eventDetails ? (
          <>
            {/* Event Details */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">{eventDetails.title}</h3>
              <p className="text-sm text-gray-700">{eventDetails.description}</p>
              <p className="text-sm text-gray-700">
                Total Tickets: <strong>{eventDetails.totalTickets}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Available Tickets: <strong>{eventDetails.availableTickets}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Ticket Price: <strong>${eventDetails.ticketPrice}</strong>
              </p>
            </div>

            {/* Add Tickets Form */}
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              {/* Ticket Price Input */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Ticket Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ticket price"
                  required
                />
              </div>

              {/* Ticket Count Input */}
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  id="count"
                  name="count"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of tickets"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Add Tickets"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-600">{message || "Loading event details..."}</p>
        )}
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(AddTicketsPage, ["VENDOR"]);
