// src/api/deliveryPartnersApi.js
import api from "./axiosClient";

export const getAvailablePartners = () =>
  api.get("/api/delivery-partners");
