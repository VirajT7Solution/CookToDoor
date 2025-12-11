package com.platemate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.platemate.enums.OrderStatus;

@Entity
@Table(name = "orders")
@AttributeOverride(name = "id", column = @Column(name = "order_id"))
public class Order extends BaseEntity {

    // ---------------- Relationships ----------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer; // FK → customers.customer_id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private TiffinProvider provider; // FK → tiffin_providers.provider_id

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_partner_id")
    private DeliveryPartner deliveryPartner; // FK → delivery_partners.delivery_partner_id

    // ---------------- Enums ----------------

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus = OrderStatus.PENDING;

    // ---------------- Other Fields ----------------

    @Column(name = "cart_item_ids", nullable = false, columnDefinition = "TEXT")
    private String cartItemIds; // JSON array of cart_item_id (stored as String)

    @Column(name = "delivery_fee", nullable = false)
    private Double deliveryFee = 0.00;

    @Column(name = "platform_commission", nullable = false)
    private Double platformCommission = 0.00;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "order_time", nullable = false, updatable = false)
    private LocalDateTime orderTime;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Column(name = "otp", length = 6)
    private String otp; // 6-digit OTP for delivery verification

    @Column(name = "otp_generated_at")
    private LocalDateTime otpGeneratedAt;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    // ---------------- Lifecycle Hooks ----------------

    @PrePersist
    protected void onCreate() {
        orderTime = LocalDateTime.now();
        if (orderStatus == null) {
            orderStatus = OrderStatus.PENDING;
        }
        if (deliveryFee == null) deliveryFee = 0.00;
        if (platformCommission == null) platformCommission = 0.00;
        if (isDeleted == null) isDeleted = false;
    }

    public Order() {}

    // Getters and Setters
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public TiffinProvider getProvider() {
        return provider;
    }

    public void setProvider(TiffinProvider provider) {
        this.provider = provider;
    }

    public DeliveryPartner getDeliveryPartner() {
        return deliveryPartner;
    }

    public void setDeliveryPartner(DeliveryPartner deliveryPartner) {
        this.deliveryPartner = deliveryPartner;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getCartItemIds() {
        return cartItemIds;
    }

    public void setCartItemIds(String cartItemIds) {
        this.cartItemIds = cartItemIds;
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

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

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
}
