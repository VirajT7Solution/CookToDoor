package com.platemate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bank_account_details")
@AttributeOverride(name = "id", column = @Column(name = "bank_account_id"))
public class BankAccountDetails extends BaseEntity {

    // ---------------- Relationships ----------------
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // FK → users.user_id

    // ---------------- Fields ----------------
    @Column(name = "account_number", nullable = false, length = 20)
    private String accountNumber;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    private String ifscCode;

    @Column(name = "branch_code", nullable = false, length = 10)
    private String branchCode;

    @Column(name = "account_holder_name", nullable = false, length = 255)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "branch_name", nullable = false, length = 100)
    private String branchName;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    // ---------------- Lifecycle Hooks ----------------
    @PrePersist
    protected void onCreate() {
        if (isVerified == null) isVerified = false;
        if (isDeleted == null) isDeleted = false;
    }

    public BankAccountDetails() {
    }

    public BankAccountDetails(User user, String accountNumber, String ifscCode, String branchCode,
            String accountHolderName, String bankName, String branchName, Boolean isVerified, Boolean isDeleted) {
        this.user = user;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.branchCode = branchCode;
        this.accountHolderName = accountHolderName;
        this.bankName = bankName;
        this.branchName = branchName;
        this.isVerified = isVerified;
        this.isDeleted = isDeleted;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
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
