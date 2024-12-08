import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/events/all"); // Replace with your API URL
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome to the Ticketing System
        </h2>
        <p className="mt-4 text-lg text-center text-gray-600">
          Discover and book tickets for upcoming events.
        </p>

        {/* Events Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800">Upcoming Events</h3>
          {loading ? (
            <p className="mt-4 text-center text-gray-600">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
                >
                  <h4 className="text-xl font-bold text-gray-800">{event.title}</h4>
                  <p className="mt-2 text-gray-600">{event.description}</p>
                  <Link
                    to={`/event/${event.id}`}
                    className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 inline-block"
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-600">No events available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
