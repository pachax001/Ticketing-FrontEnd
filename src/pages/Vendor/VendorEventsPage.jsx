import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";

const VendorEventsPage = ({ token, role }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const vendorId = localStorage.getItem("vendorId"); // Retrieve vendorId from localStorage

  useEffect(() => {
    const fetchVendorEvents = async () => {
      try {
        setLoading(true);
        if (!vendorId) {
          setMessage("Vendor ID is missing. Please log in again.");
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/vendor/${vendorId}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching vendor events:", error);
        setMessage("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorEvents();
  }, [token, vendorId]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await axios.delete(
        `http://localhost:8080/api/v1/vendor/${vendorId}/event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data);
      setEvents(events.filter((event) => event.eventId !== eventId)); // Update UI after deletion
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
      setMessage(error.response?.data || "Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Your Events</h2>

        {message && (
          <div
            className={`p-4 mb-4 ${
              message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } border border-gray-300 rounded-md`}
          >
            {message}
          </div>
        )}

        {loading && <p className="text-center text-gray-600">Loading events...</p>}

        {events.length > 0 ? (
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div key={event.eventId} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.description}</p>
                <p className="text-sm text-gray-700">
                  Total Tickets: <strong>{event.totalTickets}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Available Tickets: <strong>{event.availableTickets}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Ticket Price: <strong>${event.ticketPrice}</strong>
                </p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => navigate(`/vendor/add-tickets?eventId=${event.eventId}`)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Tickets
                  </button>
                  <button
                    onClick={() => navigate(`/vendor/delete-tickets?eventId=${event.eventId}`)}
                    className="px-4 py-2 text-sm text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                  >
                    Delete Tickets
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.eventId)}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-600">You have no events listed.</p>
        )}
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(VendorEventsPage, ["VENDOR"]);
