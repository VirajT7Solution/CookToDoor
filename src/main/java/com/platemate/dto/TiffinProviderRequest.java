package com.platemate.dto;

public class TiffinProviderRequest {
    private Long user;
    private Long zone;
    private String businessName;
    private String description;
    private Double commissionRate;
    private Boolean providesDelivery;
    private Double deliveryRadius;
    private Boolean isVerified;

    public Long getUser() { return user; }
    public void setUser(Long user) { this.user = user; }

    public Long getZone() { return zone; }
    public void setZone(Long zone) { this.zone = zone; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getCommissionRate() { return commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }

    public Boolean getProvidesDelivery() { return providesDelivery; }
    public void setProvidesDelivery(Boolean providesDelivery) { this.providesDelivery = providesDelivery; }

    public Double getDeliveryRadius() { return deliveryRadius; }
    public void setDeliveryRadius(Double deliveryRadius) { this.deliveryRadius = deliveryRadius; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
}
