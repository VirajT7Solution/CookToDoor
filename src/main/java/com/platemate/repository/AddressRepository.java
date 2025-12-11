package com.platemate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platemate.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}