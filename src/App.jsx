import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import EventDetails from "./pages/Landing/EventDetails";
import BuyTicketsPage from "./pages/Customer/BuyTicketsPage";
import AddEventPage from "./pages/Vendor/AddEventPage";
import AddTicketsPage from "./pages/Vendor/AddTicketsPage";
import CustomerEventsPage from "./pages/Customer/CustomerEventsPage";
import DeleteTicketsPage from "./pages/Vendor/DeleteTicketsPage";
import VendorEventsPage from "./pages/Vendor/VendorEventsPage";
import Dashboard from "./pages/Vendor/Dashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/customer/buy-tickets" element={<BuyTicketsPage />} />
        <Route path="/vendor/add-event" element={<AddEventPage />} />
        <Route path="/vendor/add-tickets" element={<AddTicketsPage />} />
        <Route path="/customer/events" element={<CustomerEventsPage />} />
        <Route path="/vendor/delete-tickets" element={<DeleteTicketsPage />} />
        <Route path="/vendor/events" element={<VendorEventsPage />} />
        <Route path="/vendor/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
