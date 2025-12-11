package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platemate.model.Order;
import com.platemate.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findAllByIsDeletedFalse();
    
    Optional<Payment> findTopByOrderOrderByCreatedAtDesc(Order order);
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByOrder_IdAndIsDeletedFalse(Long orderId);
}


