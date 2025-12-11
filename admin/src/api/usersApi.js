// src/api/usersApi.js
import api from "./axiosClient";

// GET all users
export const getUsers = () => api.get("/api/users");

// GET single user
export const getUserById = (id) => api.get(`/api/users/${id}`);

// CREATE user
export const createUser = (data) => api.post("/api/users", data);

// UPDATE user
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);

// DELETE user
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
