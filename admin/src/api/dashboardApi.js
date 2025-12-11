// src/api/dashboardApi.js
import api from "./axiosClient";

// Get comprehensive dashboard statistics
export const getDashboardStats = () => 
  api.get("/api/admin/dashboard/stats");

