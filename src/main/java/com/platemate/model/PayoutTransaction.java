package com.platemate.model;

import java.time.LocalDateTime;

import com.platemate.enums.PayoutMethod;
import com.platemate.enums.PayoutStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "payout_transactions")
@AttributeOverride(name = "id", column = @Column(name = "transaction_id"))
public class PayoutTransaction extends BaseEntity {

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "razorpayx_payout_id", length = 100)
    private String razorpayxPayoutId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PayoutStatus status;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "processed_by")
    private Long processedBy; // Admin user ID

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PayoutMethod paymentMethod;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        if (isDeleted == null) isDeleted = false;
        if (status == null) status = PayoutStatus.PENDING;
        if (paymentMethod == null) paymentMethod = PayoutMethod.CASH; // Default to CASH
    }

    public PayoutTransaction() {}

    public PayoutTransaction(Long providerId, Double amount, String razorpayxPayoutId, 
                            PayoutStatus status, LocalDateTime processedAt, Long processedBy, 
                            PayoutMethod paymentMethod, Boolean isDeleted) {
        this.providerId = providerId;
        this.amount = amount;
        this.razorpayxPayoutId = razorpayxPayoutId;
        this.status = status != null ? status : PayoutStatus.PENDING;
        this.processedAt = processedAt;
        this.processedBy = processedBy;
        this.paymentMethod = paymentMethod != null ? paymentMethod : PayoutMethod.CASH;
        this.isDeleted = isDeleted != null ? isDeleted : false;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getRazorpayxPayoutId() {
        return razorpayxPayoutId;
    }

    public void setRazorpayxPayoutId(String razorpayxPayoutId) {
        this.razorpayxPayoutId = razorpayxPayoutId;
    }

    public PayoutStatus getStatus() {
        return status;
    }

    public void setStatus(PayoutStatus status) {
        this.status = status != null ? status : PayoutStatus.PENDING;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public Long getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(Long processedBy) {
        this.processedBy = processedBy;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted != null ? isDeleted : false;
    }

    public PayoutMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PayoutMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}


