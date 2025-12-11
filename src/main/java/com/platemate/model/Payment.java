package com.platemate.model;

import java.time.LocalDateTime;

import com.platemate.enums.PaymentMethod;
import com.platemate.enums.PaymentStatus;
import com.platemate.enums.PaymentType;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
@AttributeOverride(name = "id", column = @Column(name = "payment_id"))
public class Payment extends BaseEntity {

    // ---------------- Relationship ----------------
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order; // FK → orders.order_id

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    // ---------------- Lifecycle Hooks ----------------
    @PrePersist
    protected void onCreate() {
        if (isDeleted == null) isDeleted = false;
    }

    public Payment() {
    }

    public Payment(Order order, PaymentType paymentType, Double amount, PaymentStatus paymentStatus,
            PaymentMethod paymentMethod, String transactionId, LocalDateTime paymentTime, Boolean isDeleted) {
        this.order = order;
        this.paymentType = paymentType;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentTime = paymentTime;
        this.isDeleted = isDeleted;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
