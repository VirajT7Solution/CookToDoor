package com.platemate.controller;

import com.platemate.dto.TiffinProviderRequest;
import com.platemate.enums.AddressType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Address;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.AddressRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.repository.MenuItemRepository;
import com.platemate.repository.ImageRepository;
import com.platemate.service.TiffinProviderService;
import com.platemate.model.MenuItem;
import com.platemate.enums.ImageType;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderController {

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TiffinProviderService tiffinProviderService;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ImageRepository imageRepository;

    /**
     * Check if provider profile is complete (onboarding status)
     * GET /api/provider/profile-complete
     */
    @GetMapping("/profile-complete")
    public ResponseEntity<Map<String, Object>> checkProfileComplete() {
        User user = getCurrentUser();
        TiffinProvider provider = tiffinProviderRepository.findByUser_Id(user.getId());

        Map<String, Object> response = new HashMap<>();
        
        if (provider == null) {
            // No provider profile exists, still in onboarding
            response.put("isComplete", false);
            response.put("isOnboarding", true);
        } else {
            // Check isOnboarding field
            boolean isOnboarding = Boolean.TRUE.equals(provider.getIsOnboarding());
            response.put("isComplete", !isOnboarding);
            response.put("isOnboarding", isOnboarding);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Get current provider details
     * GET /api/provider/details
     */
    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getProviderDetails() {
        User user = getCurrentUser();
        TiffinProvider provider = tiffinProviderRepository.findByUser_Id(user.getId());

        if (provider == null) {
            throw new ResourceNotFoundException("Provider profile not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", provider.getId()); // Provider ID needed for image upload
        response.put("user", provider.getUser().getId());
        response.put("businessName", provider.getBusinessName());
        response.put("description", provider.getDescription());
        response.put("commissionRate", provider.getCommissionRate());
        response.put("providesDelivery", provider.getProvidesDelivery());
        response.put("deliveryRadius", provider.getDeliveryRadius());
        response.put("zone", provider.getZone() != null ? provider.getZone().getId() : null);
        response.put("isVerified", provider.getIsVerified());
        response.put("isOnboarding", provider.getIsOnboarding());

        // Get address if exists - map backend format to Android format
        // Always return address structure (even if null) to prevent Android crashes
        Map<String, Object> addressMap = new HashMap<>();
        if (user.getAddress() != null) {
            Address address = user.getAddress();
            // Map street1 to street (Android uses single street field)
            addressMap.put("street", address.getStreet1() != null ? address.getStreet1() : "");
            addressMap.put("city", address.getCity() != null ? address.getCity() : "");
            addressMap.put("state", address.getState() != null ? address.getState() : "");
            // Map pincode to zipCode
            addressMap.put("zipCode", address.getPincode() != null ? address.getPincode() : "");
        } else {
            // Return empty address structure for new providers
            addressMap.put("street", "");
            addressMap.put("city", "");
            addressMap.put("state", "");
            addressMap.put("zipCode", "");
        }
        response.put("address", addressMap);

        return ResponseEntity.ok(response);
    }

    /**
     * Save or update provider details
     * POST /api/provider/details
     */
    @PostMapping("/details")
    public ResponseEntity<Map<String, Object>> saveProviderDetails(@RequestBody Map<String, Object> request) {
        User user = getCurrentUser();
        TiffinProvider existingProvider = tiffinProviderRepository.findByUser_Id(user.getId());

        // Extract data from request
        String businessName = (String) request.get("businessName");
        String description = (String) request.get("description");
        Double commissionRate = request.get("commissionRate") != null ? 
            Double.parseDouble(request.get("commissionRate").toString()) : null;
        Boolean providesDelivery = request.get("providesDelivery") != null ? 
            (Boolean) request.get("providesDelivery") : false;
        Double deliveryRadius = request.get("deliveryRadius") != null ? 
            Double.parseDouble(request.get("deliveryRadius").toString()) : null;
        Long zoneId = request.get("zone") != null ? 
            Long.parseLong(request.get("zone").toString()) : null;

        // Extract address
        Map<String, Object> addressMap = (Map<String, Object>) request.get("address");
        String street = addressMap != null ? (String) addressMap.get("street") : null;
        String city = addressMap != null ? (String) addressMap.get("city") : null;
        String state = addressMap != null ? (String) addressMap.get("state") : null;
        String zipCode = addressMap != null ? (String) addressMap.get("zipCode") : null;

        TiffinProvider provider;

        if (existingProvider == null) {
            // Create new provider
            TiffinProviderRequest providerRequest = new TiffinProviderRequest();
            providerRequest.setUser(user.getId());
            providerRequest.setZone(zoneId);
            providerRequest.setBusinessName(businessName);
            providerRequest.setDescription(description);
            providerRequest.setCommissionRate(commissionRate);
            providerRequest.setProvidesDelivery(providesDelivery);
            providerRequest.setDeliveryRadius(deliveryRadius);

            provider = tiffinProviderService.createProvider(providerRequest);
        } else {
            // Update existing provider
            existingProvider.setBusinessName(businessName);
            existingProvider.setDescription(description);
            existingProvider.setCommissionRate(commissionRate);
            existingProvider.setProvidesDelivery(providesDelivery);
            existingProvider.setDeliveryRadius(deliveryRadius);
            
            // Update zone if provided
            if (zoneId != null) {
                tiffinProviderService.assignZone(existingProvider.getId(), zoneId);
            }

            provider = existingProvider;
        }

        // Save/update address
        if (street != null && city != null && state != null && zipCode != null) {
            Address address = user.getAddress();
            if (address == null) {
                address = new Address();
                address.setUser(user);
                address.setAddressType(AddressType.BUSINESS); // Default for provider
            }
            // Map Android street to backend street1
            address.setStreet1(street);
            address.setStreet2(""); // Android doesn't have street2
            address.setCity(city);
            address.setState(state);
            // Map Android zipCode to backend pincode
            address.setPincode(zipCode);
            address = addressRepository.save(address);
            user.setAddress(address);
            userRepository.save(user);
        }

        // Mark onboarding as complete
        provider.setIsOnboarding(false);
        provider = tiffinProviderRepository.save(provider);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Provider details saved successfully");
        response.put("isOnboarding", false);
        response.put("providerId", provider.getId());

        return ResponseEntity.ok(response);
    }

    /**
     * Get provider's menu items (products) in Android-compatible format
     * GET /api/provider/products
     * This endpoint allows providers to view their products even if not verified
     */
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getProviderProducts() {
        User user = getCurrentUser();
        TiffinProvider provider = tiffinProviderRepository.findByUser_Id(user.getId());
        
        if (provider == null) {
            throw new ResourceNotFoundException("Provider profile not found");
        }
        
        // Get menu items for this provider (even if not verified - they can view their own products)
        // Use a query that eagerly loads category to avoid LazyInitializationException
        List<MenuItem> menuItems = menuItemRepository.findAllByProvider_IdAndIsDeletedFalseWithCategory(provider.getId());
        
        // Convert to Android-compatible format with null safety
        List<Map<String, Object>> products = menuItems.stream().map(item -> {
            Map<String, Object> product = new HashMap<>();
            
            // Ensure id is never null
            product.put("id", item.getId() != null ? item.getId() : 0L);
            
            // Ensure name is never null - use empty string if null
            product.put("name", item.getItemName() != null && !item.getItemName().isEmpty() 
                ? item.getItemName() : "Unnamed Product");
            
            // Ensure description is never null - use empty string if null
            product.put("description", item.getDescription() != null ? item.getDescription() : "");
            
            // Ensure price is never null - use 0.0 if null
            product.put("price", item.getPrice() != null ? item.getPrice() : 0.0);
            
            // Get category (eagerly loaded via EntityGraph)
            if (item.getCategory() != null && item.getCategory().getCategoryName() != null) {
                product.put("category", item.getCategory().getCategoryName());
                product.put("categoryId", item.getCategory().getId());
            } else {
                product.put("category", "Uncategorized");
                product.put("categoryId", null);
            }
            
            // Ensure isAvailable is never null
            product.put("isAvailable", item.getIsAvailable() != null ? item.getIsAvailable() : true);
            
            // Ensure quantity is never null - always set to 0
            product.put("quantity", 0);
            
            // Add unitsOfMeasurement (weight in grams)
            product.put("unitsOfMeasurement", item.getUnitsOfMeasurement() != null ? item.getUnitsOfMeasurement() : 0.0);
            
            // Add maxQuantity
            product.put("maxQuantity", item.getMaxQuantity() != null ? item.getMaxQuantity() : 0);
            
            // Ensure providerId is never null
            product.put("providerId", provider.getId() != null ? String.valueOf(provider.getId()) : "0");
            
            // Get image ID if exists - construct full URL for Android
            try {
                Long imageId = imageRepository.findIdByImageTypeAndOwnerId(ImageType.PRODUCT, item.getId());
                if (imageId != null) {
                    // Construct relative image URL - Android will prepend base URL
                    product.put("imageUrl", "/images/view/" + imageId);
                } else {
                    // Use empty string instead of null to prevent crashes
                    product.put("imageUrl", "");
                }
            } catch (Exception e) {
                // If image lookup fails, set to empty string
                product.put("imageUrl", "");
            }
            
            return product;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(products);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}

