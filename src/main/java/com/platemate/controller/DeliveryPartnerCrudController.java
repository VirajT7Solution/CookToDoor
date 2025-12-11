package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.DeliveryPartnerDtos;
import com.platemate.enums.Role;
import com.platemate.exception.ForbiddenException;
import com.platemate.exception.ResourceAlreadyExistsException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.DeliveryPartner;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.DeliveryPartnerRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.DeliveryPartnerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/delivery-partners")
public class DeliveryPartnerCrudController {

    @Autowired
    private DeliveryPartnerService service;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;
    
    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','DELIVERY_PARTNER','PROVIDER')")
    @Transactional
    public ResponseEntity<DeliveryPartnerDtos.Response> create(@RequestBody DeliveryPartnerDtos.CreateRequest req) {
        User currentUser = getCurrentUser();
        Role currentRole = currentUser.getRole();
        
        // Step 1: Validate and create User account for delivery partner
        validateUserCredentials(req.getUsername(), req.getEmail());
        User user = createDeliveryPartnerUser(req.getUsername(), req.getEmail(), req.getPassword());
        
        // Step 2: Create DeliveryPartner
        DeliveryPartner p = new DeliveryPartner();
        p.setUser(user);
        p.setFullName(req.getFullName());
        p.setVehicleType(req.getVehicleType());
        p.setServiceArea(req.getServiceArea());
        p.setIsAvailable(false); // Default to unavailable
        
        Long providerId = null;
        
        // If caller is PROVIDER: Auto-set provider from auth context
        if (currentRole == Role.ROLE_PROVIDER) {
            TiffinProvider provider = getCurrentProvider();
            providerId = provider.getId();
        }
        // If caller is ADMIN: Use providerId from request (or null for global)
        else if (currentRole == Role.ROLE_ADMIN) {
            providerId = req.getProviderId(); // Can be null for global
        }
        // If caller is DELIVERY_PARTNER: Set provider to null (global) or allow provider to be set if specified
        else if (currentRole == Role.ROLE_DELIVERY_PARTNER) {
            providerId = req.getProviderId(); // Usually null for global
        }
        
        DeliveryPartner saved = service.create(p, providerId);
        return ResponseEntity.ok(toResponse(saved));
    }
    
    /**
     * Validates username and email uniqueness
     */
    private void validateUserCredentials(String username, String email) {
        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }
    }
    
    /**
     * Creates a User account for delivery partner with ROLE_DELIVERY_PARTNER role
     */
    private User createDeliveryPartnerUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Encrypt password
        user.setRole(Role.ROLE_DELIVERY_PARTNER); // Set role to ROLE_DELIVERY_PARTNER
        
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DELIVERY_PARTNER','PROVIDER')")
    public ResponseEntity<DeliveryPartnerDtos.Response> update(@PathVariable Long id, @RequestBody DeliveryPartnerDtos.UpdateRequest req) {
        User currentUser = getCurrentUser();
        Role currentRole = currentUser.getRole();
        
        DeliveryPartner u = new DeliveryPartner();
        u.setFullName(req.getFullName());
        u.setVehicleType(req.getVehicleType());
        u.setServiceArea(req.getServiceArea());
        u.setIsAvailable(req.getIsAvailable());
        
        Long providerId = null;
        
        // If caller is PROVIDER: Validate ownership before update
        if (currentRole == Role.ROLE_PROVIDER) {
            TiffinProvider provider = getCurrentProvider();
            providerId = provider.getId();
        }
        // If caller is ADMIN: Allow update without ownership check
        else if (currentRole == Role.ROLE_ADMIN) {
            providerId = null; // Admin can update any
        }
        // If caller is DELIVERY_PARTNER: Only allow if it's their own profile
        else if (currentRole == Role.ROLE_DELIVERY_PARTNER) {
            DeliveryPartner existing = service.getById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with id " + id));
            // Validate that the delivery partner belongs to the current user
            if (existing.getUser() == null || !existing.getUser().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("Delivery partner can only update their own profile");
            }
            // Preserve existing provider association
            providerId = existing.getProviderId();
        }
        
        DeliveryPartner saved = service.update(id, u, providerId);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER','DELIVERY_PARTNER')")
    public ResponseEntity<List<DeliveryPartnerDtos.Response>> list() {
        User currentUser = getCurrentUser();
        Role currentRole = currentUser.getRole();
        
        List<DeliveryPartner> partners;
        
        // If caller is PROVIDER: Return only their own delivery partners
        if (currentRole == Role.ROLE_PROVIDER) {
            TiffinProvider provider = getCurrentProvider();
            partners = service.listByProvider(provider.getId());
        }
        // If caller is ADMIN: Return all delivery partners
        else if (currentRole == Role.ROLE_ADMIN) {
            partners = service.listActive();
        }
        // If caller is DELIVERY_PARTNER: Return all their delivery partner profiles (can have multiple for different providers)
        else {
            partners = deliveryPartnerRepository.findByUser_IdAndIsDeletedFalse(currentUser.getId());
            if (partners.isEmpty()) {
                throw new ResourceNotFoundException("Delivery partner profile not found");
            }
        }
        
        List<DeliveryPartnerDtos.Response> data = partners.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER','DELIVERY_PARTNER')")
    public ResponseEntity<DeliveryPartnerDtos.Response> getById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Role currentRole = currentUser.getRole();
        
        DeliveryPartner partner = service.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with id " + id));
        
        // If caller is PROVIDER: Validate ownership or return 403
        if (currentRole == Role.ROLE_PROVIDER) {
            TiffinProvider provider = getCurrentProvider();
            if (partner.getProviderId() == null || !partner.getProviderId().equals(provider.getId())) {
                throw new ForbiddenException("Provider does not own this delivery partner");
            }
        }
        // If caller is ADMIN: Return any delivery partner
        // If caller is DELIVERY_PARTNER: Return only their own profile
        else if (currentRole == Role.ROLE_DELIVERY_PARTNER) {
            // Validate that the delivery partner belongs to the current user
            if (partner.getUser() == null || !partner.getUser().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("Delivery partner can only view their own profile");
            }
        }
        
        return ResponseEntity.ok(toResponse(partner));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROVIDER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Role currentRole = currentUser.getRole();
        
        Long providerId = null;
        
        // If caller is PROVIDER: Validate ownership before delete
        if (currentRole == Role.ROLE_PROVIDER) {
            TiffinProvider provider = getCurrentProvider();
            providerId = provider.getId();
        }
        // If caller is ADMIN: Allow delete without ownership check
        // providerId remains null
        
        service.softDelete(id, providerId);
        return ResponseEntity.noContent().build();
    }

    private DeliveryPartnerDtos.Response toResponse(DeliveryPartner p) {
        DeliveryPartnerDtos.Response res = new DeliveryPartnerDtos.Response();
        res.setId(p.getId());
        res.setUserId(p.getUser() != null ? p.getUser().getId() : null);
        res.setProviderId(p.getProviderId());
        res.setFullName(p.getFullName());
        res.setVehicleType(p.getVehicleType());
        res.setServiceArea(p.getServiceArea());
        res.setIsAvailable(p.getIsAvailable());
        return res;
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


