package com.platemate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.AddressRequest;
import com.platemate.model.Address;
import com.platemate.service.UserService;

import com.platemate.exception.ResourceNotFoundException;


@RestController
@RequestMapping("/api/users")
public class AddressController {
    
    @Autowired
    private UserService userService;

    // ---------------- Single-address upsert ----------------
    @PostMapping("/{userId}/address")
    public ResponseEntity<Address> upsertAddressForUser(@RequestBody AddressRequest address, @PathVariable Long userId) {
        var user = userService.getUserById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        Address newAddress = user.getAddress() != null ? user.getAddress() : new Address();
        newAddress.setUser(user);
        newAddress.setStreet1(address.getStreet1());
        newAddress.setStreet2(address.getStreet2());
        newAddress.setCity(address.getCity());
        newAddress.setState(address.getState());
        newAddress.setAddressType(address.getAddress_type());
        newAddress.setPincode(address.getPincode());

        // Persist via user to keep FK on users.address_id in sync
        user.setAddress(newAddress);
        userService.createUser(user);

        return ResponseEntity.ok(user.getAddress());
    }
}
