// src/api/payoutsApi.js
import api from "./axiosClient";

// Get all providers with pending amounts
export const getProvidersWithPendingAmounts = () =>
  api.get("/api/admin/payouts/providers");

// Get provider payout details
export const getProviderPayoutDetails = (providerId) =>
  api.get(`/api/admin/payouts/providers/${providerId}`);

// Process payout
export const processPayout = (providerId, amount, paymentMethod = "CASH") =>
  api.post(`/api/admin/payouts/process/${providerId}`, { 
    amount,
    paymentMethod 
  });

// Get payout history
export const getPayoutHistory = (providerId, from, to) => {
  const params = {};
  if (providerId) params.providerId = providerId;
  if (from) params.from = from;
  if (to) params.to = to;
  return api.get("/api/admin/payouts/history", { params });
};


