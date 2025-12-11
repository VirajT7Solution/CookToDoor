package com.platemate.controller;

import com.platemate.enums.ImageType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.MenuItem;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.ImageRepository;
import com.platemate.repository.MenuItemRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ProductController - Backward-compatible endpoint for Android apps
 * 
 * This controller handles the old endpoint /api/products/provider
 * to maintain compatibility with Android apps that haven't been updated.
 * 
 * The new endpoint is /api/provider/products in ProviderController.
 */
@RestController
@RequestMapping("/api/products")
@PreAuthorize("hasRole('PROVIDER')")
public class ProductController {

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ImageRepository imageRepository;

    /**
     * Backward-compatible endpoint for Android apps
     * GET /api/products/provider
     * 
     * This endpoint provides the same functionality as /api/provider/products
     * but uses the old path structure for backward compatibility.
     * 
     * @return List of products (menu items) in Android-compatible format
     */
    @GetMapping("/provider")
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

    /**
     * Get current authenticated user from security context
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}

