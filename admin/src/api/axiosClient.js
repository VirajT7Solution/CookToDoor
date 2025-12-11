// src/api/axiosClient.js
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach token on every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("platemate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - auto logout
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/"; // back to login
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
