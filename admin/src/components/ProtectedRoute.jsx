// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const { token, role } = useAuthStore();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (role !== "ROLE_ADMIN") {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-red-600">
          Access Denied — Admin Only Area
        </h1>
      </div>
    );
  }

  return children;
}
