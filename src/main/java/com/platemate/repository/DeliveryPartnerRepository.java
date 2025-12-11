package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.model.DeliveryPartner;

public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    List<DeliveryPartner> findAllByIsDeletedFalse();
    
    // User-specific queries (returns List since one user can have multiple delivery partners)
    List<DeliveryPartner> findByUser_IdAndIsDeletedFalse(Long userId);
    
    // Find by user and provider (for specific delivery partner profile)
    Optional<DeliveryPartner> findByUser_IdAndProviderIdAndIsDeletedFalse(Long userId, Long providerId);
    
    // Provider-specific queries
    List<DeliveryPartner> findByProviderIdAndIsDeletedFalse(Long providerId);
    
    List<DeliveryPartner> findByProviderIdIsNullAndIsDeletedFalse();
    
    @Query("SELECT dp FROM DeliveryPartner dp WHERE (dp.providerId = :providerId OR dp.providerId IS NULL) AND dp.isDeleted = false")
    List<DeliveryPartner> findByProviderIdOrProviderIdIsNullAndIsDeletedFalse(@Param("providerId") Long providerId);
    
    Optional<DeliveryPartner> findByIdAndProviderIdAndIsDeletedFalse(Long id, Long providerId);
}


