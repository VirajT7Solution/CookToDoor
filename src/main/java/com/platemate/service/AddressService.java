package com.platemate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Address;
import com.platemate.repository.AddressRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }

    public Address updateAddress(Long id, Address updateAddress) {
        return addressRepository.findById(id).map(address -> {
            address.setStreet1(updateAddress.getStreet1());
            address.setStreet2(updateAddress.getStreet2());
            address.setCity(updateAddress.getCity());
            address.setState(updateAddress.getState());
            address.setPincode(updateAddress.getPincode());
            address.setAddressType(updateAddress.getAddressType());
            return addressRepository.save(address);
        }).orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + id));
    }
}
