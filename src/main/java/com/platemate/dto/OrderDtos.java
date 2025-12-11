package com.platemate.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.platemate.enums.OrderStatus;

public class OrderDtos {
    
    public static class CreateRequest {
        private List<Long> cartItemIds;
        private String deliveryAddress;
        private Double deliveryFee;
        private String paymentMethod; // CASH for COD, UPI/CREDIT_CARD/etc for Razorpay
        
        public List<Long> getCartItemIds() {
            return cartItemIds;
        }
        
        public void setCartItemIds(List<Long> cartItemIds) {
            this.cartItemIds = cartItemIds;
        }
        
        public String getDeliveryAddress() {
            return deliveryAddress;
        }
        
        public void setDeliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
        }
        
        public Double getDeliveryFee() {
            return deliveryFee;
        }
        
        public void setDeliveryFee(Double deliveryFee) {
            this.deliveryFee = deliveryFee;
        }
        
        public String getPaymentMethod() {
            return paymentMethod;
        }
        
        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }
    
    public static class UpdateStatusRequest {
        private OrderStatus orderStatus;
        private LocalDateTime estimatedDeliveryTime;
        
        public OrderStatus getOrderStatus() {
            return orderStatus;
        }
        
        public void setOrderStatus(OrderStatus orderStatus) {
            this.orderStatus = orderStatus;
        }
        
        public LocalDateTime getEstimatedDeliveryTime() {
            return estimatedDeliveryTime;
        }
        
        public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
            this.estimatedDeliveryTime = estimatedDeliveryTime;
        }
    }
    
    public static class OrderItemResponse {
        private Long cartItemId;
        private String itemName;
        private Integer quantity;
        private Double itemPrice;
        private Double itemTotal;
        
        public Long getCartItemId() {
            return cartItemId;
        }
        
        public void setCartItemId(Long cartItemId) {
            this.cartItemId = cartItemId;
        }
        
        public String getItemName() {
            return itemName;
        }
        
        public void setItemName(String itemName) {
            this.itemName = itemName;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public Double getItemPrice() {
            return itemPrice;
        }
        
        public void setItemPrice(Double itemPrice) {
            this.itemPrice = itemPrice;
        }
        
        public Double getItemTotal() {
            return itemTotal;
        }
        
        public void setItemTotal(Double itemTotal) {
            this.itemTotal = itemTotal;
        }
    }
    
    public static class Response {
        private Long id;
        private Long customerId;
        private Long providerId;
        private String providerName;
        private Long deliveryPartnerId;
        private String deliveryPartnerName;
        private OrderStatus orderStatus;
        private List<OrderItemResponse> cartItems;
        private Double subtotal;
        private Double deliveryFee;
        private Double platformCommission;
        private Double totalAmount;
        private String deliveryAddress;
        private LocalDateTime orderTime;
        private LocalDateTime estimatedDeliveryTime;
        private LocalDateTime deliveryTime;
        private Boolean hasOTP;
        private LocalDateTime otpExpiresAt;
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public Long getCustomerId() {
            return customerId;
        }
        
        public void setCustomerId(Long customerId) {
            this.customerId = customerId;
        }
        
        public Long getProviderId() {
            return providerId;
        }
        
        public void setProviderId(Long providerId) {
            this.providerId = providerId;
        }
        
        public String getProviderName() {
            return providerName;
        }
        
        public void setProviderName(String providerName) {
            this.providerName = providerName;
        }
        
        public Long getDeliveryPartnerId() {
            return deliveryPartnerId;
        }
        
        public void setDeliveryPartnerId(Long deliveryPartnerId) {
            this.deliveryPartnerId = deliveryPartnerId;
        }
        
        public String getDeliveryPartnerName() {
            return deliveryPartnerName;
        }
        
        public void setDeliveryPartnerName(String deliveryPartnerName) {
            this.deliveryPartnerName = deliveryPartnerName;
        }
        
        public OrderStatus getOrderStatus() {
            return orderStatus;
        }
        
        public void setOrderStatus(OrderStatus orderStatus) {
            this.orderStatus = orderStatus;
        }
        
        public List<OrderItemResponse> getCartItems() {
            return cartItems;
        }
        
        public void setCartItems(List<OrderItemResponse> cartItems) {
            this.cartItems = cartItems;
        }
        
        public Double getSubtotal() {
            return subtotal;
        }
        
        public void setSubtotal(Double subtotal) {
            this.subtotal = subtotal;
        }
        
        public Double getDeliveryFee() {
            return deliveryFee;
        }
        
        public void setDeliveryFee(Double deliveryFee) {
            this.deliveryFee = deliveryFee;
        }
        
        public Double getPlatformCommission() {
            return platformCommission;
        }
        
        public void setPlatformCommission(Double platformCommission) {
            this.platformCommission = platformCommission;
        }
        
        public Double getTotalAmount() {
            return totalAmount;
        }
        
        public void setTotalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
        }
        
        public String getDeliveryAddress() {
            return deliveryAddress;
        }
        
        public void setDeliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
        }
        
        public LocalDateTime getOrderTime() {
            return orderTime;
        }
        
        public void setOrderTime(LocalDateTime orderTime) {
            this.orderTime = orderTime;
        }
        
        public LocalDateTime getEstimatedDeliveryTime() {
            return estimatedDeliveryTime;
        }
        
        public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
            this.estimatedDeliveryTime = estimatedDeliveryTime;
        }
        
        public LocalDateTime getDeliveryTime() {
            return deliveryTime;
        }
        
        public void setDeliveryTime(LocalDateTime deliveryTime) {
            this.deliveryTime = deliveryTime;
        }
        
        public Boolean getHasOTP() {
            return hasOTP;
        }
        
        public void setHasOTP(Boolean hasOTP) {
            this.hasOTP = hasOTP;
        }
        
        public LocalDateTime getOtpExpiresAt() {
            return otpExpiresAt;
        }
        
        public void setOtpExpiresAt(LocalDateTime otpExpiresAt) {
            this.otpExpiresAt = otpExpiresAt;
        }
    }
    
    public static class DeliveryOTPRequest {
        private String otp;
        
        public String getOtp() {
            return otp;
        }
        
        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
    
    public static class DeliveryOTPResponse {
        private String otp;
        private LocalDateTime otpGeneratedAt;
        private LocalDateTime otpExpiresAt;
        private boolean hasOTP;
        
        public String getOtp() {
            return otp;
        }
        
        public void setOtp(String otp) {
            this.otp = otp;
        }
        
        public LocalDateTime getOtpGeneratedAt() {
            return otpGeneratedAt;
        }
        
        public void setOtpGeneratedAt(LocalDateTime otpGeneratedAt) {
            this.otpGeneratedAt = otpGeneratedAt;
        }
        
        public LocalDateTime getOtpExpiresAt() {
            return otpExpiresAt;
        }
        
        public void setOtpExpiresAt(LocalDateTime otpExpiresAt) {
            this.otpExpiresAt = otpExpiresAt;
        }
        
        public boolean isHasOTP() {
            return hasOTP;
        }
        
        public void setHasOTP(boolean hasOTP) {
            this.hasOTP = hasOTP;
        }
    }
}

