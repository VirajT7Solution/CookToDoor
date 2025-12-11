package com.platemate.dto;

public class PasswordResetDtos {
    
    /**
     * Request OTP for password reset
     * Accepts either username or email (or both)
     */
    public static class ForgotPasswordRequest {
        private String username;
        private String email;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
    
    /**
     * Verify OTP and Reset Password
     * Accepts either username or email (or both)
     */
    public static class ResetPasswordRequest {
        private String username;
        private String email;
        private String otp;
        private String newPassword;
        private String confirmPassword;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getOtp() {
            return otp;
        }
        
        public void setOtp(String otp) {
            this.otp = otp;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
        
        public String getConfirmPassword() {
            return confirmPassword;
        }
        
        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }
    
    /**
     * Response for password reset operations
     */
    public static class PasswordResetResponse {
        private String message;
        private boolean success;
        
        public PasswordResetResponse() {}
        
        public PasswordResetResponse(String message, boolean success) {
            this.message = message;
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
    }
    
    /**
     * Resend OTP Request
     * Accepts either username or email (or both)
     */
    public static class ResendOtpRequest {
        private String username;
        private String email;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
    
    /**
     * Verify OTP Request
     * Accepts either username or email (or both)
     */
    public static class VerifyOtpRequest {
        private String username;
        private String email;
        private String otp;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getOtp() {
            return otp;
        }
        
        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
    
    /**
     * Verify OTP Response
     */
    public static class VerifyOtpResponse {
        private boolean valid;
        private String message;
        
        public VerifyOtpResponse() {}
        
        public VerifyOtpResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }
        
        public boolean isValid() {
            return valid;
        }
        
        public void setValid(boolean valid) {
            this.valid = valid;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}

