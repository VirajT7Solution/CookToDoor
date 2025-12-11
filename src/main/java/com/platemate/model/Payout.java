package com.platemate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payouts")
@AttributeOverride(name = "id", column = @Column(name = "payout_id"))
public class Payout extends BaseEntity {

    @Column(name = "provider_id", nullable = false, unique = true)
    private Long providerId;

    @Column(name = "pending_amount", nullable = false)
    private Double pendingAmount = 0.0;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        if (isDeleted == null) isDeleted = false;
        if (pendingAmount == null) pendingAmount = 0.0;
    }

    public Payout() {}

    public Payout(Long providerId, Double pendingAmount, Boolean isDeleted) {
        this.providerId = providerId;
        this.pendingAmount = pendingAmount != null ? pendingAmount : 0.0;
        this.isDeleted = isDeleted != null ? isDeleted : false;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public Double getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(Double pendingAmount) {
        this.pendingAmount = pendingAmount != null ? pendingAmount : 0.0;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted != null ? isDeleted : false;
    }
}
