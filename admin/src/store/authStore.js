// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("cooktodor_token") || null,
  refreshToken: localStorage.getItem("cooktodor_refreshToken") || null,
  username: localStorage.getItem("cooktodor_username") || "",
  role: localStorage.getItem("cooktodor_role") || "",
  
  isAuthenticated: !!localStorage.getItem("cooktodor_token"),

  login: ({ token, refreshToken, username, role }) =>
    set(() => {
      localStorage.setItem("cooktodor_token", token);
      localStorage.setItem("cooktodor_refreshToken", refreshToken);
      localStorage.setItem("cooktodor_username", username);
      localStorage.setItem("cooktodor_role", role);

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
      localStorage.removeItem("cooktodor_token");
      localStorage.removeItem("cooktodor_refreshToken");
      localStorage.removeItem("cooktodor_username");
      localStorage.removeItem("cooktodor_role");

      return {
        token: null,
        refreshToken: null,
        username: "",
        role: "",
        isAuthenticated: false,
      };
    }),
}));
