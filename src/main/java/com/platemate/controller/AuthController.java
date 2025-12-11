package com.platemate.controller;

import com.platemate.config.security.JwtUtil;
import com.platemate.dto.PasswordResetDtos;
import com.platemate.enums.Role;
import com.platemate.exception.ResourceAlreadyExistsException;
import com.platemate.model.User;
import com.platemate.service.PasswordResetService;
import com.platemate.service.UserService;
import com.platemate.service.TiffinProviderService;
import com.platemate.service.CustomerService;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TiffinProviderService tiffinProviderService;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        // Get role and format it for client (Android expects "Provider" not "ROLE_PROVIDER")
        User user = userService.getUserDetailsByUsername(username);
        Role userRole = user.getRole();
        String roleString = formatRoleForClient(userRole);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("username", username);
        response.put("role", roleString);
        response.put("userId", user.getId()); // Include userId in login response

        return ResponseEntity.ok(response);
    }

    @Transactional
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> signupRequest) {
        String username = signupRequest.get("username");
        String email = signupRequest.get("email");
        String password = signupRequest.get("password");
        String phone = signupRequest.get("phone"); // Extract phone number from request
        String roleStr = signupRequest.getOrDefault("role", "ROLE_CUSTOMER");
        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            role = Role.ROLE_CUSTOMER; // fallback if invalid role passed
        }

        // Check if username already exists
        if (userService.getUserDetailsByUsername(username) != null) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        // Set phone number if provided
        if (phone != null && !phone.trim().isEmpty()) {
            user.setPhoneNumber(phone.trim());
        }

        User savedUser = userService.createUser(user);

        // Auto-create TiffinProvider if role is PROVIDER
        if (role == Role.ROLE_PROVIDER) {
            // Check if provider already exists (shouldn't, but safety check)
            if (tiffinProviderRepository.findByUser_Id(savedUser.getId()) == null) {
                // Create provider with default values
                tiffinProviderService.createProviderWithDefaults(savedUser);
            }
        }

        // Auto-create Customer if role is CUSTOMER
        if (role == Role.ROLE_CUSTOMER) {
            // Check if customer already exists (shouldn't, but safety check)
            if (customerRepository.findByUser_IdAndIsDeletedFalse(savedUser.getId()).isEmpty()) {
                // Create customer with default values
                customerService.createCustomerWithDefaults(savedUser);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());

        return ResponseEntity.ok(response);
    }

    /**
     * Request Password Reset OTP
     * Public endpoint - works for all user types (Admin, Provider, Delivery Partner, Customer)
     * POST /api/auth/forgot-password
     * Accepts either username or email (or both)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @RequestBody PasswordResetDtos.ForgotPasswordRequest request) {
        
        try {
            // Validate that at least one field is provided
            String username = request.getUsername();
            String email = request.getEmail();
            
            if ((username == null || username.trim().isEmpty()) && 
                (email == null || email.trim().isEmpty())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Either username or email is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = passwordResetService.sendPasswordResetOtp(username, email);
            
            Map<String, Object> response = new HashMap<>();
            // Always return success to prevent enumeration
            response.put("message", "If an account with that username/email exists, an OTP has been sent to your email.");
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in forgot password: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "An error occurred. Please try again later.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Resend OTP
     * Public endpoint
     * POST /api/auth/resend-otp
     * Accepts either username or email (or both)
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, Object>> resendOtp(
            @RequestBody PasswordResetDtos.ResendOtpRequest request) {
        
        try {
            // Validate that at least one field is provided
            String username = request.getUsername();
            String email = request.getEmail();
            
            if ((username == null || username.trim().isEmpty()) && 
                (email == null || email.trim().isEmpty())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Either username or email is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = passwordResetService.sendPasswordResetOtp(username, email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "If an account with that username/email exists, an OTP has been sent to your email.");
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in resend OTP: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "An error occurred. Please try again later.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Verify OTP
     * Public endpoint
     * POST /api/auth/verify-otp
     * Accepts either username or email (or both)
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @RequestBody PasswordResetDtos.VerifyOtpRequest request) {
        
        try {
            String username = request.getUsername();
            String email = request.getEmail();
            String otp = request.getOtp();
            
            // Validate required fields
            if (otp == null || otp.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "OTP is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if ((username == null || username.trim().isEmpty()) && 
                (email == null || email.trim().isEmpty())) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "Either username or email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean isValid = passwordResetService.verifyOtp(username, email, otp);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            response.put("message", isValid ? "OTP is valid" : "Invalid or expired OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in verify OTP: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "An error occurred while verifying OTP");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Reset Password with OTP
     * Public endpoint - works for all user types
     * POST /api/auth/reset-password
     * Accepts either username or email (or both)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody PasswordResetDtos.ResetPasswordRequest request) {
        
        try {
            String username = request.getUsername();
            String email = request.getEmail();
            
            // Validate that at least one identifier is provided
            if ((username == null || username.trim().isEmpty()) && 
                (email == null || email.trim().isEmpty())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Either username or email is required");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate passwords match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Passwords do not match");
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Reset password
            boolean success = passwordResetService.resetPasswordWithOtp(
                username,
                email,
                request.getOtp(),
                request.getNewPassword()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password has been reset successfully");
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Error in reset password: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "An error occurred. Please try again.");
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Format Role enum to client-friendly string format
     * Converts ROLE_PROVIDER → "Provider", ROLE_CUSTOMER → "Customer", etc.
     */
    private String formatRoleForClient(Role role) {
        if (role == null) {
            return "Customer";
        }
        switch (role) {
            case ROLE_PROVIDER:
                return "Provider";
            case ROLE_CUSTOMER:
                return "Customer";
            case ROLE_DELIVERY_PARTNER:
                return "Delivery Partner";
            case ROLE_ADMIN:
                return "Admin";
            default:
                return "Customer";
        }
    }
}