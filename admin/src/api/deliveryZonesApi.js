import api from "./axiosClient";

export const getZones = () => api.get("/api/delivery-zones");
export const getZoneById = (id) => api.get(`/api/delivery-zones/${id}`);
export const createZone = (data) => api.post("/api/delivery-zones", data);
export const updateZone = (id, data) => api.put(`/api/delivery-zones/${id}`, data);
export const deleteZone = (id) => api.delete(`/api/delivery-zones/${id}`);
