package com.platemate.service;

import com.platemate.model.User;
import com.platemate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${password.reset.otp.expiry.minutes:10}")
    private int otpExpiryMinutes;
    
    @Value("${password.reset.otp.resend.cooldown.seconds:60}")
    private int resendCooldownSeconds;
    
    private static final SecureRandom secureRandom = new SecureRandom();
    
    /**
     * Find user by username or email (whichever is provided)
     * Tries email first, then username
     */
    private Optional<User> findUserByUsernameOrEmail(String username, String email) {
        // Try email first (if provided)
        if (email != null && !email.trim().isEmpty()) {
            Optional<User> userByEmail = userRepository.findByEmail(email.trim());
            if (userByEmail.isPresent()) {
                return userByEmail;
            }
        }
        
        // Try username (if provided)
        if (username != null && !username.trim().isEmpty()) {
            Optional<User> userByUsername = userRepository.findByUsername(username.trim());
            if (userByUsername.isPresent()) {
                return userByUsername;
            }
        }
        
        return Optional.empty();
    }
    
    /**
     * Generate and send OTP for password reset
     * Works for all user types: Admin, Provider, Delivery Partner, Customer
     * Accepts either username or email (or both)
     */
    @Transactional
    public boolean sendPasswordResetOtp(String username, String email) {
        Optional<User> userOpt = findUserByUsernameOrEmail(username, email);
        
        // Security: Don't reveal if user exists (prevent enumeration)
        if (userOpt.isEmpty()) {
            logger.info("Password reset requested for non-existent user: username={}, email={}", username, email);
            // Still return true to prevent enumeration attacks
            return true;
        }
        
        User user = userOpt.get();
        
        // Check if there's a recent OTP request (prevent spam)
        if (user.getPasswordResetOtpGeneratedAt() != null) {
            LocalDateTime cooldownUntil = user.getPasswordResetOtpGeneratedAt()
                    .plusSeconds(resendCooldownSeconds);
            
            if (LocalDateTime.now().isBefore(cooldownUntil)) {
                long secondsRemaining = java.time.Duration.between(
                    LocalDateTime.now(), cooldownUntil).getSeconds();
                logger.warn("OTP resend requested too soon for user: {}. Wait {} seconds", 
                    user.getEmail(), secondsRemaining);
                // Return true to prevent revealing user existence
                return true;
            }
        }
        
        // Generate 6-digit OTP (same pattern as order delivery OTP)
        String otp = generateOtp();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryTime = now.plusMinutes(otpExpiryMinutes);
        
        // Save OTP to user
        user.setPasswordResetOtp(otp);
        user.setPasswordResetOtpExpiry(expiryTime);
        user.setPasswordResetOtpGeneratedAt(now);
        userRepository.save(user);
        
        logger.info("Password reset OTP generated for user: email={}", user.getEmail());
        
        // Send OTP via Gmail
        sendOtpEmail(user, otp);
        
        return true;
    }
    
    /**
     * Verify OTP and reset password
     * Accepts either username or email (or both)
     */
    @Transactional
    public boolean resetPasswordWithOtp(String username, String email, String otp, String newPassword) {
        Optional<User> userOpt = findUserByUsernameOrEmail(username, email);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid username/email or OTP");
        }
        
        User user = userOpt.get();
        
        // Check if OTP exists
        if (user.getPasswordResetOtp() == null || user.getPasswordResetOtp().isEmpty()) {
            throw new IllegalArgumentException("No OTP found. Please request a new OTP.");
        }
        
        // Check if OTP has expired
        if (user.getPasswordResetOtpExpiry() == null || 
            user.getPasswordResetOtpExpiry().isBefore(LocalDateTime.now())) {
            // Clear expired OTP
            clearResetOtp(user);
            throw new IllegalArgumentException("OTP has expired. Please request a new OTP.");
        }
        
        // Verify OTP matches
        if (!user.getPasswordResetOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP. Please check and try again.");
        }
        
        // Validate password strength
        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        
        // Reset password
        user.setPassword(passwordEncoder.encode(newPassword));
        clearResetOtp(user);
        userRepository.save(user);
        
        logger.info("Password reset successful for user: email={}", user.getEmail());
        
        // Send confirmation email
        sendPasswordResetConfirmationEmail(user);
        
        return true;
    }
    
    /**
     * Verify if OTP is valid (without resetting password)
     * Accepts either username or email (or both)
     */
    public boolean verifyOtp(String username, String email, String otp) {
        Optional<User> userOpt = findUserByUsernameOrEmail(username, email);
        
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        if (user.getPasswordResetOtp() == null || user.getPasswordResetOtp().isEmpty()) {
            return false;
        }
        
        if (user.getPasswordResetOtpExpiry() == null || 
            user.getPasswordResetOtpExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        return user.getPasswordResetOtp().equals(otp);
    }
    
    /**
     * Generate 6-digit OTP (same as order delivery OTP)
     */
    private String generateOtp() {
        int otpValue = 100000 + secureRandom.nextInt(900000); // 6-digit OTP (100000-999999)
        return String.valueOf(otpValue);
    }
    
    /**
     * Clear OTP after successful reset
     */
    private void clearResetOtp(User user) {
        user.setPasswordResetOtp(null);
        user.setPasswordResetOtpExpiry(null);
        user.setPasswordResetOtpGeneratedAt(null);
    }
    
    /**
     * Send OTP via Gmail
     */
    private void sendOtpEmail(User user, String otp) {
        String emailBody = buildOtpEmailBody(user.getUsername(), otp);
        String subject = "PlateMate - Password Reset OTP";
        
        boolean emailSent = emailService.sendEmail(user.getEmail(), subject, emailBody);
        
        if (emailSent) {
            logger.info("OTP email sent successfully to: {}", user.getEmail());
        } else {
            logger.error("Failed to send OTP email to: {}", user.getEmail());
        }
    }
    
    /**
     * Send password reset confirmation email
     */
    private void sendPasswordResetConfirmationEmail(User user) {
        String emailBody = buildPasswordResetConfirmationEmailBody(user.getUsername());
        String subject = "PlateMate - Password Reset Successful";
        
        emailService.sendEmail(user.getEmail(), subject, emailBody);
    }
    
    /**
     * Build OTP email body (HTML)
     */
    private String buildOtpEmailBody(String username, String otp) {
        StringBuilder body = new StringBuilder();
        body.append("<h1>Password Reset OTP</h1>");
        body.append("<p>Hello ").append(username).append(",</p>");
        body.append("<p>You have requested to reset your password for your PlateMate account.</p>");
        body.append("<p><strong>Your OTP code is:</strong></p>");
        
        // Large, highlighted OTP display
        body.append("<div class='button-center'>");
        body.append("<div class='content-card' style='text-align: center; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 30px; border-radius: 12px;'>");
        body.append("<h2 style='color: #ffffff; font-size: 42px; letter-spacing: 8px; margin: 0; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'>");
        body.append(otp);
        body.append("</h2>");
        body.append("</div>");
        body.append("</div>");
        
        body.append("<p>Enter this OTP code in the password reset screen to proceed.</p>");
        body.append("<p><strong>This OTP will expire in ").append(otpExpiryMinutes).append(" minutes.</strong></p>");
        body.append("<hr class='divider'>");
        body.append("<p style='font-size: 14px; color: #666;'>");
        body.append("<strong>Security Tips:</strong><br>");
        body.append("• Never share this OTP with anyone<br>");
        body.append("• PlateMate will never ask for your OTP via phone or email<br>");
        body.append("• If you didn't request this, please ignore this email");
        body.append("</p>");
        body.append("<p style='font-size: 12px; color: #999; margin-top: 30px;'>");
        body.append("This is an automated email. Please do not reply to this message.");
        body.append("</p>");
        
        return body.toString();
    }
    
    /**
     * Build password reset confirmation email body
     */
    private String buildPasswordResetConfirmationEmailBody(String username) {
        StringBuilder body = new StringBuilder();
        body.append("<h1>Password Reset Successful</h1>");
        body.append("<p>Hello ").append(username).append(",</p>");
        body.append("<p>Your password has been successfully reset.</p>");
        body.append("<div class='content-card'>");
        body.append("<p>If you did not make this change, please contact our support team immediately.</p>");
        body.append("</div>");
        body.append("<p>Thank you for using PlateMate!</p>");
        body.append("<p>- The PlateMate Team</p>");
        
        return body.toString();
    }
}

