package com.platemate.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.platemate.exception.BadRequestException;
import com.platemate.exception.ForbiddenException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.DeliveryPartner;
import com.platemate.model.Order;
import com.platemate.model.User;
import com.platemate.repository.DeliveryPartnerRepository;
import com.platemate.repository.OrderRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.enums.OrderStatus;

@Service
public class DeliveryPartnerService {

    @Autowired
    private DeliveryPartnerRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;
    @Autowired
    private OrderRepository orderRepository;

    public DeliveryPartner create(DeliveryPartner partner) {
        return repository.save(partner);
    }

    /**
     * Create a delivery partner with optional provider association.
     * One provider can have multiple delivery partners (no limit).
     * 
     * @param partner The delivery partner to create
     * @param providerId The provider ID (null for global delivery partners)
     * @return The created delivery partner
     */
    public DeliveryPartner create(DeliveryPartner partner, Long providerId) {
        if (providerId != null) {
            // Validate provider exists
            tiffinProviderRepository.findById(providerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id " + providerId));
            partner.setProviderId(providerId);
        } else {
            partner.setProviderId(null);
        }
        return repository.save(partner);
    }

    public List<DeliveryPartner> listActive() {
        return repository.findAllByIsDeletedFalse();
    }

    /**
     * List all delivery partners owned by a specific provider.
     * Returns multiple delivery partners if provider has created multiple.
     * 
     * @param providerId The provider ID
     * @return List of delivery partners owned by the provider
     */
    public List<DeliveryPartner> listByProvider(Long providerId) {
        return repository.findByProviderIdAndIsDeletedFalse(providerId);
    }

    public List<DeliveryPartner> listGlobal() {
        return repository.findByProviderIdIsNullAndIsDeletedFalse();
    }

    public List<DeliveryPartner> listForProvider(Long providerId) {
        return repository.findByProviderIdOrProviderIdIsNullAndIsDeletedFalse(providerId);
    }

    public Optional<DeliveryPartner> getById(Long id) {
        return repository.findById(id).filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()));
    }

    public Optional<DeliveryPartner> getByIdAndProvider(Long id, Long providerId) {
        return repository.findByIdAndProviderIdAndIsDeletedFalse(id, providerId);
    }

    public DeliveryPartner update(Long id, DeliveryPartner update) {
        return repository.findById(id).map(p -> {
            if (update.getFullName() != null) p.setFullName(update.getFullName());
            if (update.getVehicleType() != null) p.setVehicleType(update.getVehicleType());
            if (update.getServiceArea() != null) p.setServiceArea(update.getServiceArea());
            if (update.getIsAvailable() != null) p.setIsAvailable(update.getIsAvailable());
            return repository.save(p);
        }).orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner not found with id " + id));
    }

    public DeliveryPartner update(Long id, DeliveryPartner update, Long providerId) {
        DeliveryPartner p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner not found with id " + id));
        
        if (Boolean.TRUE.equals(p.getIsDeleted())) {
            throw new ResourceNotFoundException("DeliveryPartner not found with id " + id);
        }

        // Validate ownership if providerId is provided
        if (providerId != null) {
            if (p.getProviderId() == null || !p.getProviderId().equals(providerId)) {
                throw new ForbiddenException("Provider does not own this delivery partner");
            }
        }

        if (update.getFullName() != null) p.setFullName(update.getFullName());
        if (update.getVehicleType() != null) p.setVehicleType(update.getVehicleType());
        if (update.getServiceArea() != null) p.setServiceArea(update.getServiceArea());
        if (update.getIsAvailable() != null) p.setIsAvailable(update.getIsAvailable());
        
        return repository.save(p);
    }

    public void softDelete(Long id) {
        DeliveryPartner p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner not found with id " + id));
        p.setIsDeleted(true);
        repository.save(p);
    }

    public void softDelete(Long id, Long providerId) {
        DeliveryPartner p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner not found with id " + id));
        
        if (Boolean.TRUE.equals(p.getIsDeleted())) {
            throw new ResourceNotFoundException("DeliveryPartner not found with id " + id);
        }

        // Validate ownership if providerId is provided
        if (providerId != null) {
            if (p.getProviderId() == null || !p.getProviderId().equals(providerId)) {
                throw new ForbiddenException("Provider does not own this delivery partner");
            }
        }

        // Check for active orders
        List<OrderStatus> activeStatuses = List.of(
            OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING,
            OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY
        );
        
        boolean hasActiveOrders = orderRepository.findAllByDeliveryPartner_IdAndIsDeletedFalseOrderByOrderTimeDesc(id)
                .stream()
                .anyMatch(order -> activeStatuses.contains(order.getOrderStatus()));
        
        if (hasActiveOrders) {
            throw new BadRequestException("Cannot delete delivery partner with active orders");
        }

        p.setIsDeleted(true);
        repository.save(p);
    }

    public void validateOwnership(Long deliveryPartnerId, Long providerId) {
        DeliveryPartner p = repository.findById(deliveryPartnerId)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner not found with id " + deliveryPartnerId));
        
        if (Boolean.TRUE.equals(p.getIsDeleted())) {
            throw new ResourceNotFoundException("DeliveryPartner not found with id " + deliveryPartnerId);
        }

        // Global delivery partners (providerId = null) are accessible to all providers
        if (p.getProviderId() == null) {
            return; // Global delivery partner, accessible to all
        }

        // Provider-specific delivery partners must belong to the requesting provider
        if (!p.getProviderId().equals(providerId)) {
            throw new ForbiddenException("Provider does not own this delivery partner");
        }
    }

    public User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }
}


