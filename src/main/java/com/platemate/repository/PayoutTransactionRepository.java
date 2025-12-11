package com.platemate.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platemate.model.PayoutTransaction;

public interface PayoutTransactionRepository extends JpaRepository<PayoutTransaction, Long> {
    
    List<PayoutTransaction> findAllByProviderIdAndIsDeletedFalseOrderByProcessedAtDesc(Long providerId);
    
    Optional<PayoutTransaction> findByRazorpayxPayoutId(String razorpayxPayoutId);
    
    List<PayoutTransaction> findAllByProviderIdAndProcessedAtBetweenAndIsDeletedFalse(
        Long providerId, LocalDateTime from, LocalDateTime to);
    
    List<PayoutTransaction> findAllByIsDeletedFalseOrderByProcessedAtDesc();
    
    List<PayoutTransaction> findAllByProcessedAtBetweenAndIsDeletedFalse(LocalDateTime from, LocalDateTime to);
}


