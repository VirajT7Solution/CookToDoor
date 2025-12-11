package com.platemate.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "driving_licenses")
@AttributeOverride(name = "id", column = @Column(name = "dl_id"))
public class DrivingLicense extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "delivery_partner_id", nullable = false)
    private DeliveryPartner deliveryPartner;

    @Column(name = "dl_number", nullable = false, unique = true, length = 20)
    private String dlNumber;

    @Column(name = "dl_image_front_url", nullable = false, length = 500)
    private String dlImageFrontUrl;

    @Column(name = "dl_image_back_url", nullable = false, length = 500)
    private String dlImageBackUrl;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "issuing_authority", nullable = false, length = 100)
    private String issuingAuthority;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    public DrivingLicense() {
    }

    public DrivingLicense(DeliveryPartner deliveryPartner, String dlNumber, String dlImageFrontUrl,
            String dlImageBackUrl, LocalDate issueDate, LocalDate expiryDate, String issuingAuthority,
            Boolean isVerified, Boolean isDeleted) {
        this.deliveryPartner = deliveryPartner;
        this.dlNumber = dlNumber;
        this.dlImageFrontUrl = dlImageFrontUrl;
        this.dlImageBackUrl = dlImageBackUrl;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.issuingAuthority = issuingAuthority;
        this.isVerified = isVerified;
        this.isDeleted = isDeleted;
    }

    // ---------------- Getters & Setters ----------------

    public DeliveryPartner getDeliveryPartner() {
        return deliveryPartner;
    }

    public void setDeliveryPartner(DeliveryPartner deliveryPartner) {
        this.deliveryPartner = deliveryPartner;
    }

    public String getDlNumber() {
        return dlNumber;
    }

    public void setDlNumber(String dlNumber) {
        this.dlNumber = dlNumber;
    }

    public String getDlImageFrontUrl() {
        return dlImageFrontUrl;
    }

    public void setDlImageFrontUrl(String dlImageFrontUrl) {
        this.dlImageFrontUrl = dlImageFrontUrl;
    }

    public String getDlImageBackUrl() {
        return dlImageBackUrl;
    }

    public void setDlImageBackUrl(String dlImageBackUrl) {
        this.dlImageBackUrl = dlImageBackUrl;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
