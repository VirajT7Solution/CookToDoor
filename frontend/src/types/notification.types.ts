export interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export type SSEEventType =
  | 'connected'
  | 'unread_count'
  | 'notification'
  | 'notification_read'
  | 'notifications_all_read'
  | 'heartbeat';

export interface SSEUnreadCountData {
  unreadCount: number;
}

export interface SSENotificationData {
  id: number;
  title: string;
  message: string;
  type: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface SSENotificationReadData {
  notificationId: number;
  isRead: boolean;
}

export interface SSENotificationsAllReadData {
  allRead: boolean;
}

export type NotificationType =
  | 'ORDER_CREATED'
  | 'ORDER_UPDATE'
  | 'ORDER_CANCELLED'
  | 'PAYMENT'
  | 'DELIVERY_ASSIGNED';

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  ORDER_CREATED: 'New Order',
  ORDER_UPDATE: 'Order Update',
  ORDER_CANCELLED: 'Order Cancelled',
  PAYMENT: 'Payment Update',
  DELIVERY_ASSIGNED: 'Delivery Assigned',
};

export const NOTIFICATION_TYPE_ICONS: Record<string, string> = {
  ORDER_CREATED: '🆕',
  ORDER_UPDATE: '📦',
  ORDER_CANCELLED: '❌',
  PAYMENT: '💳',
  DELIVERY_ASSIGNED: '🚚',
};


