package com.platemate.controller;

import com.platemate.dto.EmailDto;
import com.platemate.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Send email endpoint
     * POST /api/email/send
     * 
     * Request body:
     * {
     *   "to": "recipient@example.com",
     *   "subject": "Email Subject",
     *   "body": "<p>Email body content in HTML</p>",
     *   "cc": "cc@example.com", // optional
     *   "bcc": "bcc@example.com", // optional
     *   "isHtml": true // optional, default true
     * }
     * 
     * @param emailDto Email request DTO
     * @return Response with success/error message
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendEmail(@Valid @RequestBody EmailDto emailDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success;
            
            if (emailDto.getIsHtml() != null && !emailDto.getIsHtml()) {
                // Send as plain text
                success = emailService.sendPlainTextEmail(
                    emailDto.getTo(),
                    emailDto.getSubject(),
                    emailDto.getBody()
                );
            } else {
                // Send as HTML (wrapped in template)
                success = emailService.sendEmail(
                    emailDto.getTo(),
                    emailDto.getSubject(),
                    emailDto.getBody(),
                    emailDto.getCc(),
                    emailDto.getBcc()
                );
            }
            
            if (success) {
                response.put("success", true);
                response.put("message", "Email sent successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send email");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error sending email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Send simple email (quick endpoint)
     * POST /api/email/send-simple
     * 
     * Request body:
     * {
     *   "to": "recipient@example.com",
     *   "subject": "Email Subject",
     *   "body": "Email body content"
     * }
     * 
     * @param emailDto Email request DTO
     * @return Response with success/error message
     */
    @PostMapping("/send-simple")
    public ResponseEntity<Map<String, Object>> sendSimpleEmail(@Valid @RequestBody EmailDto emailDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = emailService.sendEmail(
                emailDto.getTo(),
                emailDto.getSubject(),
                emailDto.getBody()
            );
            
            if (success) {
                response.put("success", true);
                response.put("message", "Email sent successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to send email");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error sending email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Health check endpoint for email service
     * GET /api/email/health
     * 
     * @return Email service status
     */
    @GetMapping("/health")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Email service is running");
        response.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}

