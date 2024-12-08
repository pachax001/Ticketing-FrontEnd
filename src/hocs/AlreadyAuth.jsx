import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/auth";

const AlreadyAuth = (Component) => {
  return function WrappedComponent(props) {
    const vendorToken = localStorage.getItem("jwtTokenVendor");
    const customerToken = localStorage.getItem("jwtTokenCustomer");

    const token = vendorToken || customerToken;
    const decoded = token ? decodeToken(token) : null;

    if (decoded) {
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp > currentTime) {
        const role = vendorToken ? "VENDOR" : "CUSTOMER";
        const redirectPath = role === "VENDOR" ? "/vendor/dashboard" : "/customer/events";
        return <Navigate to={redirectPath} replace />;
      }
    }

    // If no valid token, render the wrapped component
    return <Component {...props} />;
  };
};

export default AlreadyAuth;
