// src/api/ordersApi.js
import api from "./axiosClient";

// GET all orders (admin)
export const getAllOrders = () => api.get("/api/admin/orders");

// GET order by ID
export const getOrderById = (id) => api.get(`/api/admin/orders/${id}`);

// ASSIGN delivery partner
export const assignDeliveryPartner = (orderId, partnerId) =>
  api.post(`/api/admin/orders/${orderId}/assign-delivery/${partnerId}`);
