package com.cooktodor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cooktodor.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}