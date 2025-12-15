package com.cooktodor.service;

import com.cooktodor.model.Notification;
import com.cooktodor.model.User;
import com.cooktodor.repository.NotificationRepository;
import com.cooktodor.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SseEventService sseEventService;
    
    /**
     * Create and send notification via SSE
     */
    @Transactional
    public Notification createAndSendNotification(Long userId, String title, String message, 
                                                  String notificationType, String relatedEntityType, 
                                                  Long relatedEntityId) {
        try {
            // Create notification record
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setNotificationType(notificationType);
            notification.setRelatedEntityType(relatedEntityType);
            notification.setRelatedEntityId(relatedEntityId);
            notification.setIsRead(false);
            
            Notification savedNotification = notificationRepository.save(notification);
            
            // Prepare notification data for SSE
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("id", savedNotification.getId());
            notificationData.put("title", title);
            notificationData.put("message", message);
            notificationData.put("type", notificationType);
            notificationData.put("relatedEntityType", relatedEntityType);
            notificationData.put("relatedEntityId", relatedEntityId);
            notificationData.put("isRead", false);
            notificationData.put("createdAt", savedNotification.getCreatedAt().toString());
            
            // Send via SSE
            sseEventService.sendNotification(userId, "notification", notificationData);
            
            logger.info("Notification sent to user {}: {}", userId, title);
            return savedNotification;
        } catch (Exception e) {
            logger.error("Failed to create/send notification to user {}: {}", userId, e.getMessage(), e);
            // Don't throw - notification failure shouldn't break business logic
            return null;
        }
    }
    
    /**
     * Send order status update notification
     */
    public void sendOrderStatusNotification(Long userId, Long orderId, String status, String message) {
        String title = "Order Update";
        createAndSendNotification(userId, title, message, "ORDER_UPDATE", "ORDER", orderId);
    }
    
    /**
     * Send payment notification
     */
    public void sendPaymentNotification(Long userId, Long orderId, String message) {
        String title = "Payment Update";
        createAndSendNotification(userId, title, message, "PAYMENT", "ORDER", orderId);
    }
    
    /**
     * Send order creation notification
     */
    public void sendOrderCreatedNotification(Long userId, Long orderId, String message) {
        String title = "New Order";
        createAndSendNotification(userId, title, message, "ORDER_CREATED", "ORDER", orderId);
    }
    
    /**
     * Send order cancellation notification
     */
    public void sendOrderCancelledNotification(Long userId, Long orderId, String message) {
        String title = "Order Cancelled";
        createAndSendNotification(userId, title, message, "ORDER_CANCELLED", "ORDER", orderId);
    }
    
    /**
     * Send delivery partner assignment notification
     */
    public void sendDeliveryPartnerAssignedNotification(Long userId, Long orderId, String message) {
        String title = "Delivery Partner Assigned";
        createAndSendNotification(userId, title, message, "DELIVERY_ASSIGNED", "ORDER", orderId);
    }
    
    /**
     * Get user notifications
     */
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findAllByUser_IdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get unread notifications count
     */
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_IdAndIsReadFalseAndIsDeletedFalse(userId);
    }
    
    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
        
        // Send SSE update for read status
        try {
            Map<String, Object> updateData = new HashMap<>();
            updateData.put("notificationId", notificationId);
            updateData.put("isRead", true);
            sseEventService.sendNotification(userId, "notification_read", updateData);
        } catch (Exception e) {
            logger.error("Failed to send read status update via SSE", e);
        }
    }
    
    /**
     * Mark all notifications as read for user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository
                .findAllByUser_IdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        
        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notification.setReadAt(now);
        }
        notificationRepository.saveAll(unreadNotifications);
        
        // Send SSE update
        try {
            Map<String, Object> updateData = new HashMap<>();
            updateData.put("allRead", true);
            sseEventService.sendNotification(userId, "notifications_all_read", updateData);
        } catch (Exception e) {
            logger.error("Failed to send all read update via SSE", e);
        }
    }
}



