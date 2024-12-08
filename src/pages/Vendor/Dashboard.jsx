import React, { useState, useEffect } from "react";
import axios from "axios";
import WithAuth from "../../hocs/WithAuth";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = ({ token, role }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const vendorId = localStorage.getItem("vendorId"); // Retrieve vendorId from localStorage

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/v1/vendor/${vendorId}/events/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching vendor stats:", error);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, vendorId]);

  // Prepare data for the graph
  const graphData = {
    labels: stats.map((event) => event.title), // Event titles
    datasets: [
      {
        label: "Tickets Sold",
        data: stats.map((event) => event.ticketsSold), // Tickets sold for each event
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Total Income",
        data: stats.map((event) => event.totalIncome), // Income for each event
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Vendor Dashboard</h2>

        {error && (
          <div className="p-4 mt-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-4 text-center text-gray-600">Loading statistics...</p>
        ) : (
          <>
            {/* Event Statistics Table */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Event Statistics</h3>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-300">Event Title</th>
                    <th className="px-4 py-2 border border-gray-300">Description</th>
                    <th className="px-4 py-2 border border-gray-300">Tickets Sold</th>
                    <th className="px-4 py-2 border border-gray-300">Tickets Issued</th>
                    <th className="px-4 py-2 border border-gray-300">Total Income</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((event) => (
                    <tr key={event.eventId}>
                      <td className="px-4 py-2 border border-gray-300">{event.title}</td>
                      <td className="px-4 py-2 border border-gray-300">{event.description}</td>
                      <td className="px-4 py-2 border border-gray-300">{event.ticketsSold}</td>
                      <td className="px-4 py-2 border border-gray-300">{event.ticketsIssued}</td>
                      <td className="px-4 py-2 border border-gray-300">${event.totalIncome.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Graph Visualization */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Event Performance</h3>
              <div className="mt-4">
                <Line data={graphData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Enforce role-based access using WithAuth HOC
export default WithAuth(VendorDashboard, ["VENDOR"]);
