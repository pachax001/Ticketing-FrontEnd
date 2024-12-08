import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens and user-related data
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Ticketing System</h1>
        <div>
          {localStorage.getItem("jwtTokenVendor") || localStorage.getItem("jwtTokenCustomer") ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 mr-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:text-white"
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
