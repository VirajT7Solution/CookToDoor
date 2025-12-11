package com.cooktodor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cooktodor.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findAllByIsDeletedFalse();
    
    Optional<Customer> findByUser_IdAndIsDeletedFalse(Long userId);
}


