package com.cooktodor.controller;

import com.cooktodor.model.Notification;
import com.cooktodor.model.User;
import com.cooktodor.repository.UserRepository;
import com.cooktodor.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/notifications")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'DELIVERY', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getNotifications() {
        User user = getCurrentUser();
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        Long unreadCount = notificationService.getUnreadCount(user.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notifications);
        response.put("unreadCount", unreadCount);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/notifications/{id}/read")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'DELIVERY', 'ADMIN')")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        User user = getCurrentUser();
        notificationService.markAsRead(id, user.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/notifications/read-all")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'PROVIDER', 'DELIVERY', 'ADMIN')")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        User user = getCurrentUser();
        notificationService.markAllAsRead(user.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current user from security context
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}



