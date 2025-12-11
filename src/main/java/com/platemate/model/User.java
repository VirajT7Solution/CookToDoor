package com.platemate.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.platemate.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = true)
    private String phoneNumber; 
    
    @Enumerated(EnumType.STRING)   // Stores as "ROLE_CUSTOMER", "ROLE_ADMIN"
    @Column(nullable = false)
    private Role role;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;
    
    // Transient field to hold customer's fullName (for customer users)
    @Transient
    private String fullName;
    
    // Transient field to hold customer's profileImageId (for customer users)
    @Transient
    private Long profileImageId;
    
    // Password Reset OTP fields
    @Column(name = "password_reset_otp", length = 6)
    private String passwordResetOtp;

    @Column(name = "password_reset_otp_expiry")
    private LocalDateTime passwordResetOtpExpiry;

    @Column(name = "password_reset_otp_generated_at")
    private LocalDateTime passwordResetOtpGeneratedAt;
    
    // Constructors
    public User() {}

    public User(String username, String password, String email, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> role.name());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive();  // Now uses dynamic isActive field from BaseEntity
    }

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public Long getProfileImageId() {
        return profileImageId;
    }
    
    public void setProfileImageId(Long profileImageId) {
        this.profileImageId = profileImageId;
    }
    
    // Password Reset OTP Getters and Setters
    public String getPasswordResetOtp() {
        return passwordResetOtp;
    }

    public void setPasswordResetOtp(String passwordResetOtp) {
        this.passwordResetOtp = passwordResetOtp;
    }

    public LocalDateTime getPasswordResetOtpExpiry() {
        return passwordResetOtpExpiry;
    }

    public void setPasswordResetOtpExpiry(LocalDateTime passwordResetOtpExpiry) {
        this.passwordResetOtpExpiry = passwordResetOtpExpiry;
    }

    public LocalDateTime getPasswordResetOtpGeneratedAt() {
        return passwordResetOtpGeneratedAt;
    }

    public void setPasswordResetOtpGeneratedAt(LocalDateTime passwordResetOtpGeneratedAt) {
        this.passwordResetOtpGeneratedAt = passwordResetOtpGeneratedAt;
    }
    
}