import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/auth";

const WithAuth = (Component, allowedRoles) => {
  return (props) => {
    const vendorToken = localStorage.getItem("jwtTokenVendor");
    const customerToken = localStorage.getItem("jwtTokenCustomer");

    const token = vendorToken || customerToken;

    if (!token) {
      console.error("No token found in localStorage");
      return <Navigate to="/login" replace />;
    }

    // Decode the token
    const decoded = decodeToken(token);
    if (!decoded) {
      console.error("Invalid token detected");
      localStorage.clear(); // Clear invalid tokens
      return <Navigate to="/login" replace />;
    }

    // Extract role and expiration time from the token
    const { Role: tokenRole, exp } = decoded;

    console.log("Token from localStorage:", token);
    console.log("Decoded token:", decoded);
    console.log("Role from token:", tokenRole);
    console.log("Allowed roles:", allowedRoles);

    // Check token expiration
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (exp && exp < currentTime) {
      console.error("Token has expired");
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    // Check role authorization
    if (!allowedRoles.map((role) => role.toUpperCase()).includes(tokenRole.toUpperCase())) {
      console.error("Unauthorized role:", tokenRole);
      return <Navigate to="/" replace />;
    }

    // Pass token and role to the wrapped component
    return <Component {...props} token={token} role={tokenRole} />;
  };
};

export default WithAuth;
