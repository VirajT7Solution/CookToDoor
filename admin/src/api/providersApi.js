// src/api/providersApi.js
import api from "./axiosClient";

// ALL providers
export const getProviders = () => api.get("/api/tiffin-providers");

// PENDING providers
export const getPendingProviders = () =>
  api.get("/api/admin/providers/pending");

// APPROVE
export const approveProvider = (id) =>
  api.post(`/api/admin/providers/${id}/approve`);

// REJECT
export const rejectProvider = (id) =>
  api.post(`/api/admin/providers/${id}/reject`);

// PROVIDER BY ID
export const getProviderById = (id) =>
  api.get(`/api/tiffin-providers/${id}`);

// UPDATE provider
export const updateProvider = (id, data) =>
  api.put(`/api/tiffin-providers/${id}`, data);

// DELETE provider
export const deleteProvider = (id) =>
  api.delete(`/api/tiffin-providers/${id}`);
