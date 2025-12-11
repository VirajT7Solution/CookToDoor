// src/api/deliveryPartnersApi.js
import api from "./axiosClient";

// GET all delivery partners
export const getDeliveryPartners = () => api.get("/api/delivery-partners");
export const getAvailablePartners = () => getDeliveryPartners();
// GET single partner
export const getDeliveryPartnerById = (id) =>
  api.get(`/api/delivery-partners/${id}`);

// CREATE partner
export const createDeliveryPartner = (data) =>
  api.post("/api/delivery-partners", data);

// UPDATE partner
export const updateDeliveryPartner = (id, data) =>
  api.put(`/api/delivery-partners/${id}`, data);

// DELETE partner
export const deleteDeliveryPartner = (id) =>
  api.delete(`/api/delivery-partners/${id}`);
