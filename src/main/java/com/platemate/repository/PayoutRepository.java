package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.model.Payout;

import jakarta.persistence.LockModeType;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payout p WHERE p.providerId = :providerId AND p.isDeleted = false")
    Optional<Payout> findByProviderId(@Param("providerId") Long providerId);
    
    // Query without lock for initialization check
    @Query("SELECT p FROM Payout p WHERE p.providerId = :providerId AND p.isDeleted = false")
    Optional<Payout> findByProviderIdWithoutLock(@Param("providerId") Long providerId);
    
    List<Payout> findAllByPendingAmountGreaterThanAndIsDeletedFalse(Double amount);
    
    List<Payout> findAllByIsDeletedFalse();
}
