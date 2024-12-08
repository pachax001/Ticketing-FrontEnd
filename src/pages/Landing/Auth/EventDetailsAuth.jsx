import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event details from API
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/events/id/${eventId}` // Replace with your API URL
        );
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading event details...</p>;
  }

  if (!event) {
    return <p className="text-center text-gray-600">Event not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <Header />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
        <p className="mt-4 text-gray-600">{event.description}</p>
        <div className="mt-6 space-y-4">
          <p>
            <strong>Vendor Name:</strong> {event.vendorName}
          </p>
          <p>
            <strong>Vendor ID:</strong> {event.vendorId}
          </p>
          <p>
            <strong>Total Tickets:</strong> {event.totalTickets}
          </p>
          <p>
            <strong>Available Tickets:</strong> {event.availableTickets}
          </p>
          <p>
            <strong>Ticket Price:</strong> {event.ticketPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
