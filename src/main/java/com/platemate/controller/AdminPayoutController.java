package com.platemate.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.PayoutDtos;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.User;
import com.platemate.repository.UserRepository;
import com.platemate.service.PayoutService;

@RestController
@RequestMapping("/api/admin/payouts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {

    @Autowired
    private PayoutService payoutService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/providers")
    public ResponseEntity<List<PayoutDtos.ProviderPayoutDto>> getProvidersWithPendingAmounts() {
        return ResponseEntity.ok(payoutService.getProvidersWithPendingAmounts());
    }

    @GetMapping("/providers/{providerId}")
    public ResponseEntity<PayoutDtos.ProviderPayoutDetailsDto> getProviderPayoutDetails(@PathVariable Long providerId) {
        return ResponseEntity.ok(payoutService.getProviderPayoutDetails(providerId));
    }

    @PostMapping("/process/{providerId}")
    public ResponseEntity<PayoutDtos.PayoutResponseDto> processPayout(
            @PathVariable Long providerId,
            @RequestBody PayoutDtos.ProcessPayoutRequest request) {
        
        // Get current admin user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User admin = userRepository.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        // Default to CASH if payment method not specified
        String paymentMethod = request.getPaymentMethod() != null ? 
            request.getPaymentMethod() : "CASH";
        
        PayoutDtos.PayoutResponseDto response = payoutService.processPayout(
            providerId, 
            request.getAmount(), 
            paymentMethod,
            admin.getId()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PayoutDtos.PayoutHistoryDto>> getPayoutHistory(
            @RequestParam(required = false) Long providerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        
        return ResponseEntity.ok(payoutService.getPayoutHistory(providerId, from, to));
    }
}


