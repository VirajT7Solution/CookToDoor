package com.platemate.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.platemate.enums.AddressType;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @Column(name = "street1", nullable = false, length = 255)
    private String street1;

    @Column(name = "street2", nullable = false, length = 255)
    private String street2;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "pincode", nullable = false, length = 10)
    private String pincode;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_type", nullable = false)
    private AddressType addressType;


    public Address() {}

    public Address(User user, String street1, String street2, String city, String state, String pincode, AddressType addressType) {
        this.user = user;
        this.street1 = street1;
        this.street2 = street2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.addressType = addressType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStreet1() {
        return street1;
    }

    public void setStreet1(String street1) {
        this.street1 = street1;
    }

    public String getStreet2() {
        return street2;
    }

    public void setStreet2(String street2) {
        this.street2 = street2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public AddressType getAddressType() {
        return addressType;
    }

    public void setAddressType(AddressType addressType) {
        this.addressType = addressType;
    }

    
}
