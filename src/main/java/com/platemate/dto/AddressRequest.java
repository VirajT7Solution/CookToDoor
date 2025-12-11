package com.platemate.dto;

import com.platemate.enums.AddressType;

public class AddressRequest {
    private String street1;
    private String street2;
    private String city;
    private String state;
    private String pincode;
    private AddressType address_type;

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
    public AddressType getAddress_type() {
        return address_type;
    }
    public void setAddress_type(AddressType address_type) {
        this.address_type = address_type;
    }
}
