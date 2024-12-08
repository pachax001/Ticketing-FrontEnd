import React, { useState, useEffect } from "react";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";

const CustomerEventsPage = ({ token, role }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchCustomerEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/v1/customer/${userId}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching customer events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerEvents();
  }, [userId, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Your Events</h2>

        {loading && <p className="text-center text-gray-600">Loading events...</p>}

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {events.length > 0 ? (
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div key={event.eventId} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{event.eventTitle}</h3>
                <p className="text-sm text-gray-700">{event.eventDescription}</p>
                <p className="text-sm text-gray-700">
                  Tickets Bought: <strong>{event.ticketsBought}</strong>
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-600">You have not purchased tickets for any events.</p>
        )}
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(CustomerEventsPage, ["CUSTOMER"]);
