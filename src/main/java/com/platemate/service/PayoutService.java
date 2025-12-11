package com.platemate.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.platemate.dto.PayoutDtos;
import com.platemate.enums.PayoutMethod;
import com.platemate.enums.PayoutStatus;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Payout;
import com.platemate.model.PayoutTransaction;
import com.platemate.model.TiffinProvider;
import com.platemate.repository.PayoutRepository;
import com.platemate.repository.PayoutTransactionRepository;
import com.platemate.repository.TiffinProviderRepository;

@Service
public class PayoutService {

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private PayoutTransactionRepository payoutTransactionRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    /**
     * Add to pending amount when payment succeeds
     * Thread-safe with pessimistic locking
     * Uses REQUIRES_NEW to ensure independent transaction (prevents rollback issues)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void addToPendingAmount(Long providerId, Double orderAmount, Double commission) {
        if (providerId == null) {
            System.err.println("WARNING: addToPendingAmount called with null providerId");
            return; // Skip if provider ID is null
        }

        System.out.println("DEBUG: addToPendingAmount called - Provider ID: " + providerId + 
            ", Order Amount: ₹" + orderAmount + ", Commission: ₹" + commission);

        // Get or create payout record with pessimistic lock
        Payout payout = payoutRepository.findByProviderId(providerId)
            .orElseGet(() -> {
                System.out.println("DEBUG: Creating new payout entry for provider: " + providerId);
                Payout newPayout = new Payout();
                newPayout.setProviderId(providerId);
                newPayout.setPendingAmount(0.0);
                newPayout.setIsDeleted(false);
                return payoutRepository.save(newPayout);
            });

        // Calculate provider earnings (order amount - commission)
        Double providerEarnings = (orderAmount != null ? orderAmount : 0.0) - (commission != null ? commission : 0.0);
        
        // ✅ FIX: Prevent negative earnings (edge case: commission > orderAmount)
        if (providerEarnings < 0) {
            System.err.println("WARNING: Negative provider earnings calculated - Order Amount: ₹" + orderAmount + 
                ", Commission: ₹" + commission + ". Setting to 0 to prevent incorrect payout.");
            providerEarnings = 0.0;
        }
        
        // Round to 2 decimal places
        providerEarnings = Math.round(providerEarnings * 100.0) / 100.0;

        // Add to pending amount
        Double currentPending = payout.getPendingAmount() != null ? payout.getPendingAmount() : 0.0;
        Double newPending = Math.round((currentPending + providerEarnings) * 100.0) / 100.0;
        
        System.out.println("DEBUG: Payout update - Provider ID: " + providerId + 
            ", Current Pending: ₹" + currentPending + 
            ", Adding: ₹" + providerEarnings + 
            ", New Pending: ₹" + newPending);
        
        payout.setPendingAmount(newPending);
        payoutRepository.save(payout);
        
        System.out.println("DEBUG: Successfully updated pending amount for provider " + providerId + " to ₹" + newPending);
    }

    /**
     * Initialize payout entry for provider if it doesn't exist
     * Called when order is created to ensure payout record exists
     * This does NOT add any amount - amount is only added when payment succeeds
     * Uses query without lock for efficient initialization check
     */
    @Transactional
    public void initializePayoutIfNotExists(Long providerId) {
        if (providerId == null) {
            return;
        }
        
        // Check if payout entry exists (without lock for initialization)
        Optional<Payout> existing = payoutRepository.findByProviderIdWithoutLock(providerId);
        
        if (existing.isEmpty()) {
            Payout newPayout = new Payout();
            newPayout.setProviderId(providerId);
            newPayout.setPendingAmount(0.0);
            newPayout.setIsDeleted(false);
            payoutRepository.save(newPayout);
            System.out.println("DEBUG: Initialized payout entry for provider: " + providerId);
        }
    }

    /**
     * Get current pending amount for a provider
     * Uses read-only query (no lock) and initializes entry if missing
     */
    public Double getPendingAmount(Long providerId) {
        if (providerId == null) {
            return 0.0;
        }
        
        // Use read-only query (no pessimistic lock needed for reads)
        Optional<Payout> payout = payoutRepository.findByProviderIdWithoutLock(providerId);
        
        if (payout.isPresent()) {
            Double amount = payout.get().getPendingAmount();
            System.out.println("DEBUG: Retrieved pending amount for provider " + providerId + ": ₹" + amount);
            return amount != null ? amount : 0.0;
        }
        
        // Defensive: Initialize payout entry if it doesn't exist
        // This can happen if order was created before initializePayoutIfNotExists was added
        System.out.println("WARNING: Payout entry not found for provider " + providerId + ", initializing...");
        try {
            initializePayoutIfNotExists(providerId);
            // Retry after initialization
            Optional<Payout> retryPayout = payoutRepository.findByProviderIdWithoutLock(providerId);
            if (retryPayout.isPresent()) {
                Double amount = retryPayout.get().getPendingAmount();
                System.out.println("DEBUG: Initialized and retrieved pending amount for provider " + providerId + ": ₹" + amount);
                return amount != null ? amount : 0.0;
            }
        } catch (Exception e) {
            System.err.println("ERROR: Failed to initialize payout entry for provider " + providerId + ": " + e.getMessage());
            e.printStackTrace();
        }
        
        return 0.0;
    }

    /**
     * Get all providers with pending amounts (for admin)
     */
    public List<PayoutDtos.ProviderPayoutDto> getProvidersWithPendingAmounts() {
        List<Payout> payouts = payoutRepository.findAllByPendingAmountGreaterThanAndIsDeletedFalse(0.0);
        
        return payouts.stream()
            .filter(p -> p.getPendingAmount() != null && p.getPendingAmount() > 0)
            .map(p -> {
                Optional<TiffinProvider> providerOpt = tiffinProviderRepository.findById(p.getProviderId());
                if (providerOpt.isEmpty()) {
                    return null;
                }
                
                TiffinProvider provider = providerOpt.get();
                PayoutDtos.ProviderPayoutDto dto = new PayoutDtos.ProviderPayoutDto();
                dto.setProviderId(p.getProviderId());
                dto.setBusinessName(provider.getBusinessName());
                dto.setPendingAmount(p.getPendingAmount());
                
                // Get last payout date from transactions
                Optional<PayoutTransaction> lastPayout = payoutTransactionRepository
                    .findAllByProviderIdAndIsDeletedFalseOrderByProcessedAtDesc(p.getProviderId())
                    .stream()
                    .findFirst();
                
                dto.setLastPayoutDate(lastPayout.map(PayoutTransaction::getProcessedAt).orElse(null));
                return dto;
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    /**
     * Get provider payout details (for admin)
     */
    public PayoutDtos.ProviderPayoutDetailsDto getProviderPayoutDetails(Long providerId) {
        TiffinProvider provider = tiffinProviderRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        Double pendingAmount = getPendingAmount(providerId);
        
        List<PayoutTransaction> transactions = payoutTransactionRepository
            .findAllByProviderIdAndIsDeletedFalseOrderByProcessedAtDesc(providerId);
        
        Double totalPayouts = transactions.stream()
            .filter(t -> t.getStatus() == PayoutStatus.COMPLETED)
            .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
            .sum();
        
        PayoutDtos.ProviderPayoutDetailsDto dto = new PayoutDtos.ProviderPayoutDetailsDto();
        dto.setProviderId(providerId);
        dto.setBusinessName(provider.getBusinessName());
        dto.setPendingAmount(pendingAmount);
        dto.setTotalPayouts(Math.round(totalPayouts * 100.0) / 100.0);
        
        // Get recent transactions (last 10)
        List<PayoutDtos.PayoutHistoryDto> recentTransactions = transactions.stream()
            .limit(10)
            .map(this::convertToHistoryDto)
            .collect(Collectors.toList());
        
        dto.setRecentTransactions(recentTransactions);
        
        return dto;
    }

    /**
     * Process payout (admin action)
     * Simplified: Admin directly subtracts amount from pending amount
     * Supports ONLINE and CASH payment methods (saved in DB for record keeping)
     * Both methods mark as COMPLETED immediately (no RazorpayX integration)
     */
    @Transactional
    public PayoutDtos.PayoutResponseDto processPayout(Long providerId, Double amount, String paymentMethodStr, Long adminUserId) {
        // Validate amount
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Payout amount must be positive");
        }

        // Validate and parse payment method
        PayoutMethod paymentMethod;
        try {
            paymentMethod = PayoutMethod.valueOf(paymentMethodStr != null ? paymentMethodStr.toUpperCase() : "CASH");
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment method. Use 'ONLINE' or 'CASH'");
        }

        // Get payout record with pessimistic lock
        Payout payout = payoutRepository.findByProviderId(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("No payout record for provider"));

        // Validate pending amount
        Double pendingAmount = payout.getPendingAmount() != null ? payout.getPendingAmount() : 0.0;
        if (pendingAmount < amount) {
            throw new BadRequestException("Insufficient pending amount. Available: ₹" + String.format("%.2f", pendingAmount));
        }

        // Create payout transaction record
        // Both CASH and ONLINE are marked as COMPLETED immediately (no RazorpayX)
        PayoutTransaction transaction = new PayoutTransaction();
        transaction.setProviderId(providerId);
        transaction.setAmount(amount);
        transaction.setRazorpayxPayoutId(null); // No RazorpayX integration
        transaction.setStatus(PayoutStatus.COMPLETED); // Always COMPLETED
        transaction.setPaymentMethod(paymentMethod); // Save method in DB (CASH or ONLINE)
        transaction.setProcessedAt(LocalDateTime.now());
        transaction.setProcessedBy(adminUserId);
        transaction.setIsDeleted(false);
        payoutTransactionRepository.save(transaction);

        // IMPORTANT: Subtract from pending amount immediately (business logic unchanged)
        Double newPending = Math.round((pendingAmount - amount) * 100.0) / 100.0;
        payout.setPendingAmount(newPending);
        payoutRepository.save(payout);

        System.out.println("DEBUG: Payout processed - Provider: " + providerId + 
            ", Amount: ₹" + amount + ", Method: " + paymentMethod + 
            ", Status: COMPLETED, New Pending: ₹" + newPending);

        // Return response
        PayoutDtos.PayoutResponseDto response = new PayoutDtos.PayoutResponseDto();
        response.setTransactionId(transaction.getId());
        response.setAmount(amount);
        response.setRemainingPendingAmount(newPending);
        response.setRazorpayxPayoutId(null);
        response.setStatus(PayoutStatus.COMPLETED);
        response.setPaymentMethod(paymentMethod.name());
        
        return response;
    }


    /**
     * Get payout history
     */
    public List<PayoutDtos.PayoutHistoryDto> getPayoutHistory(Long providerId, LocalDateTime from, LocalDateTime to) {
        List<PayoutTransaction> transactions;
        
        if (providerId != null) {
            if (from != null && to != null) {
                transactions = payoutTransactionRepository
                    .findAllByProviderIdAndProcessedAtBetweenAndIsDeletedFalse(providerId, from, to);
            } else {
                transactions = payoutTransactionRepository
                    .findAllByProviderIdAndIsDeletedFalseOrderByProcessedAtDesc(providerId);
            }
        } else {
            if (from != null && to != null) {
                transactions = payoutTransactionRepository
                    .findAllByProcessedAtBetweenAndIsDeletedFalse(from, to);
            } else {
                transactions = payoutTransactionRepository
                    .findAllByIsDeletedFalseOrderByProcessedAtDesc();
            }
        }
        
        return transactions.stream()
            .map(this::convertToHistoryDto)
            .collect(Collectors.toList());
    }

    /**
     * Convert PayoutTransaction to PayoutHistoryDto
     * Includes provider business name for better display
     */
    private PayoutDtos.PayoutHistoryDto convertToHistoryDto(PayoutTransaction transaction) {
        PayoutDtos.PayoutHistoryDto dto = new PayoutDtos.PayoutHistoryDto();
        dto.setTransactionId(transaction.getId());
        dto.setProviderId(transaction.getProviderId());
        
        // Fetch provider business name
        String businessName = "Provider #" + transaction.getProviderId(); // Default fallback
        try {
            Optional<TiffinProvider> providerOpt = tiffinProviderRepository.findById(transaction.getProviderId());
            if (providerOpt.isPresent()) {
                TiffinProvider provider = providerOpt.get();
                if (provider.getBusinessName() != null && !provider.getBusinessName().trim().isEmpty()) {
                    businessName = provider.getBusinessName();
                }
            }
        } catch (Exception e) {
            System.err.println("WARNING: Failed to fetch provider name for provider " + transaction.getProviderId() + ": " + e.getMessage());
        }
        dto.setBusinessName(businessName);
        
        dto.setAmount(transaction.getAmount());
        dto.setStatus(transaction.getStatus());
        dto.setProcessedAt(transaction.getProcessedAt());
        dto.setRazorpayxPayoutId(transaction.getRazorpayxPayoutId());
        dto.setProcessedBy(transaction.getProcessedBy());
        dto.setPaymentMethod(transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : "CASH");
        return dto;
    }

}
