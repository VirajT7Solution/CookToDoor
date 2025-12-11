package com.platemate.dto;

import com.platemate.enums.VehicleType;

public class DeliveryPartnerDtos {
    public static class CreateRequest {
        // User account creation fields
        private String username;
        private String email;
        private String password;
        
        private Long providerId; // Optional - auto-set from auth context if provider creates
        private String fullName;
        private VehicleType vehicleType;
        private String serviceArea;
        
        // User credentials getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public VehicleType getVehicleType() { return vehicleType; }
        public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
        public String getServiceArea() { return serviceArea; }
        public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }
    }

    public static class UpdateRequest {
        private String fullName;
        private VehicleType vehicleType;
        private String serviceArea;
        private Boolean isAvailable;
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public VehicleType getVehicleType() { return vehicleType; }
        public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
        public String getServiceArea() { return serviceArea; }
        public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }
        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    }

    public static class Response {
        private Long id;
        private Long userId;
        private Long providerId; // null for global delivery partners
        private String fullName;
        private VehicleType vehicleType;
        private String serviceArea;
        private Boolean isAvailable;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public VehicleType getVehicleType() { return vehicleType; }
        public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
        public String getServiceArea() { return serviceArea; }
        public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }
        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    }
}


