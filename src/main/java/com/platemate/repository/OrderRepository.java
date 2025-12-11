package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.enums.OrderStatus;
import com.platemate.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByIsDeletedFalse();
    
    List<Order> findAllByCustomer_IdAndIsDeletedFalseOrderByOrderTimeDesc(Long customerId);
    
    List<Order> findAllByProvider_IdAndIsDeletedFalseOrderByOrderTimeDesc(Long providerId);
    
    List<Order> findAllByDeliveryPartner_IdAndIsDeletedFalseOrderByOrderTimeDesc(Long deliveryPartnerId);
    
    Optional<Order> findByIdAndCustomer_IdAndIsDeletedFalse(Long id, Long customerId);
    
    Optional<Order> findByIdAndProvider_IdAndIsDeletedFalse(Long id, Long providerId);
    
    Optional<Order> findByIdAndDeliveryPartner_IdAndIsDeletedFalse(Long id, Long deliveryPartnerId);
    
    // Filter by status for future use
    List<Order> findAllByCustomer_IdAndOrderStatusAndIsDeletedFalseOrderByOrderTimeDesc(Long customerId, OrderStatus status);
    
    List<Order> findAllByProvider_IdAndOrderStatusAndIsDeletedFalseOrderByOrderTimeDesc(Long providerId, OrderStatus status);
    
    List<Order> findAllByDeliveryPartner_IdAndOrderStatusAndIsDeletedFalseOrderByOrderTimeDesc(Long deliveryPartnerId, OrderStatus status);
    
    // Find orders by status (for available orders)
    List<Order> findAllByOrderStatusAndIsDeletedFalse(OrderStatus status);
    
    // Eagerly load order with provider for payout processing
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.provider WHERE o.id = :orderId")
    Optional<Order> findByIdWithProvider(@Param("orderId") Long orderId);
}

