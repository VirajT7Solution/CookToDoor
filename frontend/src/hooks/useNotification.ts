import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { requestNotificationPermission } from '../utils/notifications';

/**
 * Hook to manage notifications and SSE connection
 * Should be used in layout components or App component
 */
export const useNotification = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    loadNotifications,
    connectSSE,
    disconnectSSE,
  } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if not authenticated
      disconnectSSE();
      return;
    }

    // Request notification permission
    requestNotificationPermission().catch((err) => {
      console.error('Failed to request notification permission:', err);
    });

    // Load initial notifications
    loadNotifications();

    // Connect to SSE with retry
    const connectWithRetry = () => {
      try {
        connectSSE();
        console.log('SSE connection initiated');
      } catch (error) {
        console.error('Failed to connect SSE, retrying...', error);
        setTimeout(connectWithRetry, 2000);
      }
    };
    
    connectWithRetry();

    // Cleanup on unmount
    return () => {
      disconnectSSE();
    };
  }, [isAuthenticated]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    loadNotifications,
  };
};

