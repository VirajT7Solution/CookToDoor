package com.cooktodor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class SseEventService {
    
    private static final Logger logger = LoggerFactory.getLogger(SseEventService.class);
    
    // Store active SSE connections by user ID
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    
    // Scheduled executor for heartbeat
    private final ScheduledExecutorService heartbeatExecutor = 
        Executors.newScheduledThreadPool(1);
    
    /**
     * Create SSE connection for a user
     */
    public SseEmitter createConnection(Long userId) {
        // Remove existing connection if any
        removeConnection(userId);
        
        // Create new emitter with 30 minute timeout
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        
        // Set completion and timeout callbacks
        emitter.onCompletion(() -> {
            logger.info("SSE connection completed for user: {}", userId);
            emitters.remove(userId);
        });
        
        emitter.onTimeout(() -> {
            logger.info("SSE connection timeout for user: {}", userId);
            emitters.remove(userId);
            try {
                emitter.complete();
            } catch (Exception e) {
                logger.error("Error completing emitter on timeout", e);
            }
        });
        
        emitter.onError((ex) -> {
            logger.error("SSE connection error for user: {}", userId, ex);
            emitters.remove(userId);
        });
        
        emitters.put(userId, emitter);
        
        // Send initial connection message
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("SSE connection established"));
        } catch (IOException e) {
            logger.error("Failed to send initial SSE message", e);
            emitters.remove(userId);
            return null;
        }
        
        // Start heartbeat to keep connection alive
        startHeartbeat(userId, emitter);
        
        logger.info("SSE connection created for user: {}", userId);
        return emitter;
    }
    
    /**
     * Send notification event to a specific user
     */
    public void sendNotification(Long userId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
                logger.debug("Sent SSE notification to user: {}, event: {}", userId, eventName);
            } catch (IOException e) {
                logger.error("Failed to send SSE notification to user: {}", userId, e);
                // Remove broken connection
                removeConnection(userId);
            }
        } else {
            logger.debug("No active SSE connection for user: {}", userId);
        }
    }
    
    /**
     * Send notification to multiple users
     */
    public void sendNotificationToUsers(Iterable<Long> userIds, String eventName, Object data) {
        for (Long userId : userIds) {
            sendNotification(userId, eventName, data);
        }
    }
    
    /**
     * Remove connection for a user
     */
    public void removeConnection(Long userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception e) {
                logger.error("Error completing emitter", e);
            }
        }
    }
    
    /**
     * Check if user has active connection
     */
    public boolean hasConnection(Long userId) {
        return emitters.containsKey(userId);
    }
    
    /**
     * Get number of active connections
     */
    public int getActiveConnectionsCount() {
        return emitters.size();
    }
    
    /**
     * Start heartbeat to keep connection alive
     */
    private void startHeartbeat(Long userId, SseEmitter emitter) {
        heartbeatExecutor.scheduleAtFixedRate(() -> {
            if (emitters.containsKey(userId)) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("heartbeat")
                            .data("ping"));
                } catch (IOException e) {
                    logger.debug("Heartbeat failed for user: {}, removing connection", userId);
                    removeConnection(userId);
                }
            }
        }, 30, 30, TimeUnit.SECONDS); // Send heartbeat every 30 seconds
    }
}


