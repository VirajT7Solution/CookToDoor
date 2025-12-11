package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.model.TiffinProvider;
import com.platemate.service.TiffinProviderService;

@RestController
@RequestMapping("/api/admin/providers")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTiffinProviderController {

    @Autowired
    private TiffinProviderService service;

    @GetMapping("/pending")
    public ResponseEntity<List<TiffinProvider>> listPending() {
        return ResponseEntity.ok(service.getPendingProviders());
    }

    @PostMapping("/{providerId}/approve")
    public ResponseEntity<TiffinProvider> approve(@PathVariable Long providerId) {
        return ResponseEntity.ok(service.approveProvider(providerId));
    }

    @PostMapping("/{providerId}/reject")
    public ResponseEntity<TiffinProvider> reject(@PathVariable Long providerId) {
        return ResponseEntity.ok(service.rejectProvider(providerId));
    }
}


