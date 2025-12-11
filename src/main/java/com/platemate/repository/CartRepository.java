package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platemate.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findAllByIsDeletedFalse();
    
    List<Cart> findAllByCustomer_IdAndIsDeletedFalse(Long customerId);
    
    Optional<Cart> findByCustomer_IdAndMenuItem_IdAndIsDeletedFalse(Long customerId, Long menuItemId);
    
    List<Cart> findAllByCustomer_IdAndMenuItem_Provider_IdAndIsDeletedFalse(Long customerId, Long providerId);
    
    List<Cart> findAllByIdInAndIsDeletedFalse(List<Long> cartItemIds);
}

