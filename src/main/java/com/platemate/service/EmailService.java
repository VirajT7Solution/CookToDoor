package com.platemate.service;

import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${email.from.address: noreply@platemate.com}")
    private String fromAddress;
    
    @Value("${email.from.name:PlateMate}")
    private String fromName;
    
    /**
     * Validate email configuration on service initialization
     */
    @PostConstruct
    public void validateEmailConfiguration() {
        if (fromAddress == null || fromAddress.isEmpty()) {
            logger.warn("Email from address is not configured. Emails may fail to send.");
        }
        if (mailSender == null) {
            logger.error("JavaMailSender is not configured. Email service will not work!");
        } else {
            logger.info("Email service initialized. From: {}, Name: {}", fromAddress, fromName);
        }
    }
    
    /**
     * Send email with HTML template
     * 
     * @param to Email recipient
     * @param subject Email subject
     * @param body Email body (HTML content)
     * @return true if email sent successfully, false otherwise
     */
    public boolean sendEmail(String to, String subject, String body) {
        return sendEmail(to, subject, body, null, null);
    }
    
    /**
     * Send email with HTML template (with CC and BCC support)
     * 
     * @param to Email recipient
     * @param subject Email subject
     * @param body Email body (HTML content)
     * @param cc CC recipient (optional)
     * @param bcc BCC recipient (optional)
     * @return true if email sent successfully, false otherwise
     */
    public boolean sendEmail(String to, String subject, String body, String cc, String bcc) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            
            if (cc != null && !cc.trim().isEmpty()) {
                helper.setCc(cc);
            }
            
            if (bcc != null && !bcc.trim().isEmpty()) {
                helper.setBcc(bcc);
            }
            
            // Wrap body in email template
            String htmlBody = wrapInTemplate(body);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
            return true;
        } catch (AuthenticationFailedException e) {
            logger.error("Gmail authentication failed. Please check your email credentials in application.properties. " +
                        "Make sure you're using an App Password (not your regular password) and that 2FA is enabled. " +
                        "Error: {}", e.getMessage(), e);
            return false;
        } catch (MessagingException e) {
            logger.error("Messaging error while sending email to {}: {}", to, e.getMessage(), e);
            logger.error("Error details - Cause: {}, Class: {}", 
                       e.getCause() != null ? e.getCause().getMessage() : "N/A", 
                       e.getClass().getSimpleName());
            return false;
        } catch (MailException e) {
            logger.error("Mail exception while sending email to {}: {}", to, e.getMessage(), e);
            return false;
        } catch (IOException e) {
            logger.error("IO error while loading email template: {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error while sending email to {}: {}", to, e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Send email with plain text (no HTML template)
     * 
     * @param to Email recipient
     * @param subject Email subject
     * @param plainTextBody Plain text body
     * @return true if email sent successfully, false otherwise
     */
    public boolean sendPlainTextEmail(String to, String subject, String plainTextBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(plainTextBody, false);
            
            mailSender.send(message);
            logger.info("Plain text email sent successfully to: {}", to);
            return true;
        } catch (AuthenticationFailedException e) {
            logger.error("Gmail authentication failed. Please check your email credentials in application.properties. " +
                        "Make sure you're using an App Password (not your regular password) and that 2FA is enabled. " +
                        "Error: {}", e.getMessage(), e);
            return false;
        } catch (MessagingException e) {
            logger.error("Messaging error while sending plain text email to {}: {}", to, e.getMessage(), e);
            logger.error("Error details - Cause: {}, Class: {}", 
                       e.getCause() != null ? e.getCause().getMessage() : "N/A", 
                       e.getClass().getSimpleName());
            return false;
        } catch (MailException e) {
            logger.error("Mail exception while sending plain text email to {}: {}", to, e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error while sending plain text email to {}: {}", to, e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Wrap email body in HTML template
     * 
     * @param body Email body content
     * @return Complete HTML email template
     * @throws IOException if template file cannot be read
     */
    private String wrapInTemplate(String body) throws IOException {
        // Load email template
        Resource resource = new ClassPathResource("templates/email-template.html");
        String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        
        // Replace placeholders
        template = template.replace("{{BODY_CONTENT}}", body);
        template = template.replace("{{APP_NAME}}", "PlateMate");
        template = template.replace("{{FOOTER_YEAR}}", String.valueOf(java.time.Year.now().getValue()));
        
        return template;
    }
}

