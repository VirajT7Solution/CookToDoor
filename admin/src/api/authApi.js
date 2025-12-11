// src/api/authApi.js
import axiosClient from "./axiosClient";

export const loginApi = (data) => axiosClient.post("/api/auth/login", data);

// For later if needed
export const signupAdminApi = (data) =>
  axiosClient.post("/api/auth/signup", data);

// Password Reset APIs
// Accepts either username or email (or both)
export const forgotPasswordApi = (username, email) =>
  axiosClient.post("/api/auth/forgot-password", { username, email });

export const resendOtpApi = (username, email) =>
  axiosClient.post("/api/auth/resend-otp", { username, email });

export const verifyOtpApi = (username, email, otp) =>
  axiosClient.post("/api/auth/verify-otp", { username, email, otp });

export const resetPasswordApi = (username, email, otp, newPassword, confirmPassword) =>
  axiosClient.post("/api/auth/reset-password", {
    username,
    email,
    otp,
    newPassword,
    confirmPassword,
  });