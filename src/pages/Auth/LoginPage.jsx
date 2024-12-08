import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { decodeToken } from "../../utils/auth";
import AlreadyAuth from "../../hocs/AlreadyAuth";
const InputField = ({ label, id, type, value, onChange, togglePassword, showPassword }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      placeholder={`Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      required
    />
    {id === "password" && (
      <FontAwesomeIcon
        icon={showPassword ? faEyeSlash : faEye}
        className="absolute right-3 top-9 cursor-pointer text-gray-500"
        onClick={togglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
      />
    )}
  </div>
);

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginData({
      username: "",
      password: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent duplicate requests

    const endpoint =
      activeTab === "vendor"
        ? "http://localhost:8080/api/v1/auth/vendor/login"
        : "http://localhost:8080/api/v1/auth/customer/login";

    try {
      setLoading(true);
      const response = await axios.post(endpoint, loginData);

      const token = response.data.jwt;
      if (!token) throw new Error("No token received from server");

      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) throw new Error("Invalid token");

      // Save token and userId
      localStorage.setItem(
        activeTab === "vendor" ? "jwtTokenVendor" : "jwtTokenCustomer",
        token
      );
      localStorage.setItem(
        activeTab === "vendor" ? "vendorId" : "customerId",
        response.data.userId
      );

      // Calculate auto logout time
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeRemaining = expirationTime - currentTime;

      if (timeRemaining > 0) {
        setTimeout(() => {
          localStorage.clear();
          alert("Your session has expired. Please log in again.");
          window.location.href = "/login";
        }, timeRemaining);
      }

      alert(`${activeTab} login successful!`);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleTabChange("customer")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            aria-label="Switch to Customer Login"
          >
            Customer Login
          </button>
          <button
            onClick={() => handleTabChange("vendor")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "vendor"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            aria-label="Switch to Vendor Login"
          >
            Vendor Login
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {activeTab === "customer" ? "Customer Login" : "Vendor Login"}
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <InputField
              label="Username"
              id="username"
              type="text"
              value={loginData.username}
              onChange={handleInputChange}
            />
            <InputField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={handleInputChange}
              togglePassword={togglePassword}
              showPassword={showPassword}
            />
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white rounded-md ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlreadyAuth(LoginPage);
