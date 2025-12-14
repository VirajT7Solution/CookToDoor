import axiosClient from './axiosClient';
import type { Order, UpdateOrderStatusRequest } from '../types/order.types';

export const orderApi = {
  /**
   * Get all orders for the current provider
   */
  getProviderOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/api/providers/orders');
    return response.data;
  },

  /**
   * Get order by ID
   */
  getProviderOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/api/providers/orders/${id}`);
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    id: number,
    data: UpdateOrderStatusRequest
  ): Promise<Order> => {
    const response = await axiosClient.put<Order>(
      `/api/providers/orders/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.post<Order>(
      `/api/providers/orders/${id}/cancel`
    );
    return response.data;
  },

  // ==================== Delivery Partner Order Endpoints ====================

  /**
   * Get all orders assigned to the current delivery partner
   */
  getDeliveryPartnerOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/api/delivery-partners/orders');
    return response.data;
  },

  /**
   * Get order details for delivery partner
   */
  getDeliveryPartnerOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/api/delivery-partners/orders/${id}`);
    return response.data;
  },

  /**
   * Get available orders (READY status, unassigned)
   */
  getAvailableOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/api/delivery-partners/available-orders');
    return response.data;
  },

  /**
   * Accept an available order
   */
  acceptOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.post<Order>(`/api/delivery-partners/orders/${id}/accept`);
    return response.data;
  },

  /**
   * Pickup order (changes status to OUT_FOR_DELIVERY)
   */
  pickupOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.post<Order>(`/api/delivery-partners/orders/${id}/pickup`);
    return response.data;
  },

  /**
   * Deliver order with OTP
   */
  deliverOrder: async (id: number, otp: string): Promise<Order> => {
    const response = await axiosClient.post<Order>(`/api/delivery-partners/orders/${id}/deliver`, {
      otp,
    });
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (id: number, otp: string): Promise<{ valid: boolean; message: string }> => {
    const response = await axiosClient.post<{ valid: boolean; message: string }>(
      `/api/delivery-partners/orders/${id}/verify-otp`,
      { otp }
    );
    return response.data;
  },
};
