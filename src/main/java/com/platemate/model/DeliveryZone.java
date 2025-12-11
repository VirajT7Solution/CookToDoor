package com.platemate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "delivery_zones")
@AttributeOverride(name = "id", column = @Column(name = "zone_id"))
public class DeliveryZone extends BaseEntity {

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "pincode_ranges", nullable = false, columnDefinition = "TEXT")
    private String pincodeRanges; // JSON format

    public DeliveryZone() {}

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincodeRanges() { return pincodeRanges; }
    public void setPincodeRanges(String pincodeRanges) { this.pincodeRanges = pincodeRanges; }
}