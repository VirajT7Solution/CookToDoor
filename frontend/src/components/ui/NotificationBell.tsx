import React, { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/notification.types';
import { NOTIFICATION_TYPE_ICONS, NOTIFICATION_TYPE_LABELS } from '../../types/notification.types';
// Helper function to format date
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

interface NotificationBellProps {
  size?: 'sm' | 'md' | 'lg';
}

const NotificationBell: React.FC<NotificationBellProps> = ({ size = 'md' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    isLoading,
    isConnected,
  } = useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Reload notifications when dropdown opens
      loadNotifications();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, loadNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to related entity if available
    if (notification.relatedEntityType === 'ORDER' && notification.relatedEntityId) {
      const role = localStorage.getItem('cooktodor_role');
      if (role === 'ROLE_CUSTOMER') {
        navigate(`/customer/orders/${notification.relatedEntityId}`);
      } else if (role === 'ROLE_PROVIDER') {
        navigate(`/provider/orders`);
      } else if (role === 'ROLE_DELIVERY_PARTNER') {
        navigate(`/delivery/dashboard`);
      }
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const iconSize = size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px';
  const badgeSize = size === 'sm' ? '16px' : size === 'lg' ? '20px' : '20px';

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: theme.spacing(1),
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radius.full,
          transition: theme.transitions.base,
          color: theme.colors.text,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.light;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ fontSize: iconSize }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: theme.colors.error,
              color: theme.colors.white,
              fontSize: theme.font.size.xs,
              fontWeight: theme.font.weight.bold,
              borderRadius: theme.radius.full,
              minWidth: badgeSize,
              height: badgeSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `0 ${theme.spacing(0.5)}`,
              border: `2px solid ${theme.colors.white}`,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isConnected && (
          <span
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '8px',
              height: '8px',
              backgroundColor: 'orange',
              borderRadius: theme.radius.full,
              border: `1px solid ${theme.colors.white}`,
            }}
            title="SSE disconnected"
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: theme.spacing(1),
            width: '360px',
            maxHeight: '500px',
            backgroundColor: theme.colors.white,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadow.lg,
            border: `1px solid ${theme.colors.border}`,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: theme.spacing(3),
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: theme.font.size.lg,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.dark,
              }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
                  fontSize: theme.font.size.xs,
                  color: theme.colors.primary,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: theme.font.weight.medium,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div
            style={{
              overflowY: 'auto',
              maxHeight: '400px',
            }}
          >
            {isLoading ? (
              <div
                style={{
                  padding: theme.spacing(4),
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                }}
              >
                <p style={{ margin: 0 }}>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: theme.spacing(4),
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                }}
              >
                <p style={{ margin: 0 }}>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: theme.spacing(3),
                    borderBottom: `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    backgroundColor: notification.isRead
                      ? theme.colors.white
                      : `${theme.colors.primary}05`,
                    transition: theme.transitions.base,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.isRead
                      ? theme.colors.white
                      : `${theme.colors.primary}05`;
                  }}
                >
                  <div style={{ display: 'flex', gap: theme.spacing(2) }}>
                    <div
                      style={{
                        fontSize: theme.font.size.xl,
                        flexShrink: 0,
                      }}
                    >
                      {NOTIFICATION_TYPE_ICONS[notification.notificationType] || '📢'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: theme.spacing(1),
                          marginBottom: theme.spacing(0.5),
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: theme.font.size.sm,
                            fontWeight: notification.isRead
                              ? theme.font.weight.normal
                              : theme.font.weight.semibold,
                            color: theme.colors.dark,
                          }}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: theme.radius.full,
                              backgroundColor: theme.colors.primary,
                              flexShrink: 0,
                              marginTop: theme.spacing(0.5),
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: theme.font.size.xs,
                          color: theme.colors.textSecondary,
                          lineHeight: 1.5,
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        {notification.message}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: theme.font.size.xs,
                            color: theme.colors.textSecondary,
                          }}
                        >
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        <span
                          style={{
                            fontSize: theme.font.size.xs,
                            color: theme.colors.textSecondary,
                            padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
                            backgroundColor: theme.colors.light,
                            borderRadius: theme.radius.sm,
                          }}
                        >
                          {NOTIFICATION_TYPE_LABELS[notification.notificationType] ||
                            notification.notificationType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

