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
};
