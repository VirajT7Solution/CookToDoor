package com.platemate.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.PayoutService;

@RestController
@RequestMapping("/api")
public class PayoutController {

    @Autowired
    private PayoutService payoutService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @GetMapping("/providers/payouts/pending")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Map<String, Double>> getPendingAmount() {
        try {
            TiffinProvider provider = getCurrentProvider();
            Long providerId = provider.getId();
            
            System.out.println("DEBUG: Fetching pending amount for provider ID: " + providerId);
            Double pendingAmount = payoutService.getPendingAmount(providerId);
            
            System.out.println("DEBUG: Returning pending amount for provider " + providerId + ": ₹" + pendingAmount);
            
            Map<String, Double> response = new HashMap<>();
            response.put("pendingAmount", pendingAmount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to get pending amount: " + e.getMessage());
            e.printStackTrace();
            // Return 0.0 on error instead of failing the request
            Map<String, Double> response = new HashMap<>();
            response.put("pendingAmount", 0.0);
            return ResponseEntity.ok(response);
        }
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private TiffinProvider getCurrentProvider() {
        User user = getCurrentUser();
        TiffinProvider provider = tiffinProviderRepository.findByUser_Id(user.getId());
        if (provider == null) {
            throw new ResourceNotFoundException("Provider profile not found for user");
        }
        return provider;
    }
}
