import { create } from 'zustand';
import type { Notification } from '../types/notification.types';
import { notificationApi } from '../api/notificationApi';
import { sseService } from '../services/sseService';
import type {
  SSEEventType,
  SSENotificationData,
  SSENotificationReadData,
  SSEUnreadCountData,
} from '../types/notification.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Actions
  loadNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  updateNotificationReadStatus: (id: number, isRead: boolean) => void;
  setUnreadCount: (count: number) => void;
  clearNotifications: () => void;
  connectSSE: () => void;
  disconnectSSE: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  // SSE event handler
  const handleSSEEvent = (eventType: SSEEventType, data: any) => {
    switch (eventType) {
      case 'connected':
        set({ isConnected: true, error: null });
        // Reload notifications when connected
        get().loadNotifications();
        break;

      case 'unread_count':
        const unreadData = data as SSEUnreadCountData;
        set({ unreadCount: unreadData.unreadCount });
        break;

      case 'notification':
        console.log('Processing notification event:', data);
        const notificationData = data as SSENotificationData;
        
        // Validate data
        if (!notificationData || !notificationData.id) {
          console.error('Invalid notification data received:', notificationData);
          break;
        }
        
        // Convert SSE notification data to Notification format
        const newNotification: Notification = {
          id: notificationData.id,
          title: notificationData.title,
          message: notificationData.message,
          notificationType: notificationData.type,
          relatedEntityType: notificationData.relatedEntityType,
          relatedEntityId: notificationData.relatedEntityId,
          isRead: notificationData.isRead || false,
          createdAt: notificationData.createdAt,
          updatedAt: notificationData.createdAt,
          isActive: true,
        };
        
        console.log('Adding notification to store:', newNotification);
        
        // Add to beginning of list (avoid duplicates)
        set((state) => {
          // Check if notification already exists
          const exists = state.notifications.some(n => n.id === newNotification.id);
          if (exists) {
            console.log('Notification already exists, skipping:', newNotification.id);
            return state;
          }
          
          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: newNotification.isRead ? state.unreadCount : state.unreadCount + 1,
          };
        });

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
            });
          } catch (error) {
            console.error('Failed to show browser notification:', error);
          }
        }
        break;

      case 'notification_read':
        const readData = data as SSENotificationReadData;
        get().updateNotificationReadStatus(readData.notificationId, readData.isRead);
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
        break;

      case 'notifications_all_read':
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
        break;

      case 'heartbeat':
        // Ignore heartbeat
        break;
    }
  };

  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isConnected: false,
    error: null,

    loadNotifications: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await notificationApi.getNotifications();
        console.log('Loaded notifications:', response);
        
        // Ensure notifications is an array
        const notificationsList = Array.isArray(response.notifications) 
          ? response.notifications 
          : [];
        
        set({
          notifications: notificationsList,
          unreadCount: response.unreadCount || 0,
          isLoading: false,
        });
      } catch (error: any) {
        console.error('Failed to load notifications:', error);
        set({
          error: error.message || 'Failed to load notifications',
          isLoading: false,
          notifications: [], // Ensure it's always an array
        });
      }
    },

    markAsRead: async (id: number) => {
      try {
        await notificationApi.markAsRead(id);
        get().updateNotificationReadStatus(id, true);
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      } catch (error: any) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    },

    markAllAsRead: async () => {
      try {
        await notificationApi.markAllAsRead();
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      } catch (error: any) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
      }
    },

    addNotification: (notification: Notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }));
    },

    updateNotificationReadStatus: (id: number, isRead: boolean) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead, readAt: isRead ? new Date().toISOString() : undefined } : n
        ),
      }));
    },

    setUnreadCount: (count: number) => {
      set({ unreadCount: count });
    },

    clearNotifications: () => {
      set({ notifications: [], unreadCount: 0 });
    },

    connectSSE: () => {
      sseService.connect(handleSSEEvent);
      set({ isConnected: true });
    },

    disconnectSSE: () => {
      sseService.disconnect();
      set({ isConnected: false });
    },
  };
});

