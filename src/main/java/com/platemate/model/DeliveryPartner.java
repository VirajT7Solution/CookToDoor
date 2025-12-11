package com.platemate.model;

import jakarta.persistence.*;
import com.platemate.enums.VehicleType;
import java.util.List;

@Entity
@Table(name = "delivery_partners")
@AttributeOverride(name = "id", column = @Column(name = "delivery_partner_id"))
public class DeliveryPartner extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // One user can have multiple delivery partner records (for different providers)

    @Column(name = "provider_id", nullable = true)
    private Long providerId; 

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Column(name = "service_area", nullable = false, columnDefinition = "TEXT")
    private String serviceArea;

    @Transient
    private List<RatingReview> ratings;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    public DeliveryPartner() {}

    // Getters and setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
}
