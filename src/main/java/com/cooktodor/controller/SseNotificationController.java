package com.cooktodor.controller;

import com.cooktodor.model.User;
import com.cooktodor.repository.UserRepository;
import com.cooktodor.service.NotificationService;
import com.cooktodor.service.SseEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SseNotificationController {
    
    private static final Logger logger = LoggerFactory.getLogger(SseNotificationController.class);
    
    @Autowired
    private SseEventService sseEventService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * SSE endpoint for real-time notifications
     * Client connects to this endpoint and receives events
     * Uses read-only transaction to optimize connection usage
     */
    @GetMapping(value = "/notifications/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'DELIVERY', 'ADMIN')")
    @Transactional(readOnly = true)
    public SseEmitter streamNotifications() {
        User user = getCurrentUser();
        logger.info("SSE connection request from user: {}", user.getId());
        
        // Get unread count before creating emitter to minimize transaction time
        Long unreadCount = notificationService.getUnreadCount(user.getId());
        
        SseEmitter emitter = sseEventService.createConnection(user.getId());
        
        if (emitter == null) {
            logger.error("Failed to create SSE connection for user: {}", user.getId());
            // Return a completed emitter to avoid null
            SseEmitter errorEmitter = new SseEmitter(0L);
            errorEmitter.completeWithError(new RuntimeException("Failed to create SSE connection"));
            return errorEmitter;
        }
        
        // Send initial unread count
        try {
            Map<String, Object> initialData = new HashMap<>();
            initialData.put("unreadCount", unreadCount);
            emitter.send(SseEmitter.event()
                    .name("unread_count")
                    .data(initialData));
        } catch (Exception e) {
            logger.error("Failed to send initial unread count", e);
        }
        
        return emitter;
    }
    
    /**
     * Get SSE connection status
     */
    @GetMapping("/notifications/stream/status")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'DELIVERY', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getConnectionStatus() {
        User user = getCurrentUser();
        boolean hasConnection = sseEventService.hasConnection(user.getId());
        int totalConnections = sseEventService.getActiveConnectionsCount();
        
        Map<String, Object> response = new HashMap<>();
        response.put("connected", hasConnection);
        response.put("totalActiveConnections", totalConnections);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current user from security context
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}



