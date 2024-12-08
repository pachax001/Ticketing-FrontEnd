import React, { useState, useEffect } from "react";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";
import Header from "../../components/Header";
const BuyTicketsPage = ({ token,role }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDetails, setEventDetails] = useState(null); // State for event details
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
const customerId = localStorage.getItem("customerId"); // Retrieve customerId from localStorage
  // Fetch all events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/events/all");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch details for the selected event
  const handleEventChange = async (eventId) => {
    setSelectedEvent(eventId);
    setEventDetails(null); // Clear previous details
    if (!eventId) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/events/id/${eventId}`);
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setEventDetails(null);
    }
  };

  // Handle ticket purchase submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Please select an event.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerId: customerId ,
        eventId: selectedEvent,
        count: ticketCount,
      };

      const responset = await axios.post(
        "http://localhost:8080/api/v1/customer/buy",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      console.log("Payload:", payload);
      console.log("Token:", token);
      console.log(responset.data);
      alert("Tickets purchased successfully!");
    } catch (error) {
      console.error("Error purchasing tickets:", error.response?.data || error.message);
      alert(`Failed to purchase tickets. ${error.response?.data?.error || ""}`);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Buy Tickets</h2>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {/* Event Dropdown */}
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700">
              Select Event
            </label>
            <select
              id="event"
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select an Event --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Event Details */}
          {eventDetails && (
            <div className="p-4 mt-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">{eventDetails.title}</h3>
              <p className="text-sm text-gray-700">{eventDetails.description}</p>
              <p className="text-sm text-gray-700">
                Vendor: <strong>{eventDetails.vendorName}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Total Tickets: <strong>{eventDetails.totalTickets}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Available Tickets: <strong>{eventDetails.availableTickets}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Ticket Price: <strong>{eventDetails.ticketPrice}</strong>
              </p>
            </div>
          )}

          {/* Ticket Count */}
          <div>
            <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700">
              Number of Tickets
            </label>
            <input
              type="number"
              id="ticketCount"
              min="1"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Tickets"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(BuyTicketsPage, ["CUSTOMER"]);
