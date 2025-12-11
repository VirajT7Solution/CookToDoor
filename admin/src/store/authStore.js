// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("platemate_token") || null,
  refreshToken: localStorage.getItem("platemate_refreshToken") || null,
  username: localStorage.getItem("platemate_username") || "",
  role: localStorage.getItem("platemate_role") || "",
  
  isAuthenticated: !!localStorage.getItem("platemate_token"),

  login: ({ token, refreshToken, username, role }) =>
    set(() => {
      localStorage.setItem("platemate_token", token);
      localStorage.setItem("platemate_refreshToken", refreshToken);
      localStorage.setItem("platemate_username", username);
      localStorage.setItem("platemate_role", role);

      return {
        token,
        refreshToken,
        username,
        role,
        isAuthenticated: true,
      };
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem("platemate_token");
      localStorage.removeItem("platemate_refreshToken");
      localStorage.removeItem("platemate_username");
      localStorage.removeItem("platemate_role");

      return {
        token: null,
        refreshToken: null,
        username: "",
        role: "",
        isAuthenticated: false,
      };
    }),
}));
