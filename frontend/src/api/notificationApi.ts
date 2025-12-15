import axiosClient from './axiosClient';
import type { Notification, NotificationResponse } from '../types/notification.types';

export const notificationApi = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (): Promise<NotificationResponse> => {
    const response = await axiosClient.get<NotificationResponse>('/api/notifications');
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: number): Promise<void> => {
    await axiosClient.put(`/api/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosClient.put('/api/notifications/read-all');
  },

  /**
   * Get SSE connection status
   */
  getConnectionStatus: async (): Promise<{ connected: boolean; totalActiveConnections: number }> => {
    const response = await axiosClient.get<{ connected: boolean; totalActiveConnections: number }>(
      '/api/notifications/stream/status'
    );
    return response.data;
  },
};


