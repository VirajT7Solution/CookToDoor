package com.platemate.controller;

import java.util.DoubleSummaryStatistics;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.MenuItemDtos;
import com.platemate.enums.MealType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Customer;
import com.platemate.model.MenuItem;
import com.platemate.model.RatingReview;
import com.platemate.model.User;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.MenuItemService;
import com.platemate.service.RatingReviewService;

@RestController
@RequestMapping("/api/customers/menu-items")
public class CustomerMenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private RatingReviewService ratingReviewService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Get all available menu items with pagination
     * Query params: page (default 0), size (default 20), sort (default "id,asc")
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> getAllMenuItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.getAvailableMenuItems(pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Get menu items by provider ID with pagination
     */
    @GetMapping("/provider/{providerId}")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> getMenuItemsByProvider(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.getAvailableMenuItemsByProvider(providerId, pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Get menu items by category ID with pagination
     */
    @GetMapping("/category/{categoryId}")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> getMenuItemsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.getAvailableMenuItemsByCategory(categoryId, pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Get menu items by meal type with pagination
     */
    @GetMapping("/meal-type/{mealType}")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> getMenuItemsByMealType(
            @PathVariable MealType mealType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.getAvailableMenuItemsByMealType(mealType, pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Search menu items by name or description with pagination
     */
    @GetMapping("/search")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> searchMenuItems(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.searchAvailableMenuItems(q, pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Get menu items by provider and category with pagination
     */
    @GetMapping("/provider/{providerId}/category/{categoryId}")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse>> getMenuItemsByProviderAndCategory(
            @PathVariable Long providerId,
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortParams[0]);
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<MenuItem> menuItemsPage = menuItemService.getAvailableMenuItemsByProviderAndCategory(
                providerId, categoryId, pageable);
        
        Page<MenuItemDtos.CustomerResponse> responsePage = menuItemsPage.map(this::toCustomerResponse);
        MenuItemDtos.PaginatedResponse<MenuItemDtos.CustomerResponse> paginatedResponse = 
            new MenuItemDtos.PaginatedResponse<>(responsePage);
        return ResponseEntity.ok(paginatedResponse);
    }

    /**
     * Get a single menu item by ID
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<MenuItemDtos.CustomerResponse> getMenuItemById(@PathVariable Long id) {
        MenuItem menuItem = menuItemService.getAvailableMenuItemById(id);
        return ResponseEntity.ok(toCustomerResponse(menuItem));
    }

    /**
     * Convert MenuItem entity to CustomerResponse DTO
     */
    private MenuItemDtos.CustomerResponse toCustomerResponse(MenuItem item) {
        MenuItemDtos.CustomerResponse response = new MenuItemDtos.CustomerResponse();
        response.setId(item.getId());
        response.setItemName(item.getItemName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setIngredients(item.getIngredients());
        response.setMealType(item.getMealType());
        response.setUnitsOfMeasurement(item.getUnitsOfMeasurement());
        response.setMaxQuantity(item.getMaxQuantity());
        
        if (item.getCategory() != null) {
            response.setCategoryId(item.getCategory().getId());
            response.setCategoryName(item.getCategory().getCategoryName());
        }
        
        if (item.getProvider() != null) {
            response.setProviderId(item.getProvider().getId());
            response.setProviderBusinessName(item.getProvider().getBusinessName());
            if (item.getProvider().getUser() != null) {
                response.setProviderName(item.getProvider().getUser().getUsername());
            }
        }
        
        // Map images to base64 lists - access base64Data within transaction
        if (item.getImages() != null && !item.getImages().isEmpty()) {
            java.util.List<String> base64List = new java.util.ArrayList<>();
            java.util.List<String> fileTypeList = new java.util.ArrayList<>();
            
            for (com.platemate.model.Image image : item.getImages()) {
                // Explicitly access base64Data to ensure it's loaded within transaction
                String base64 = image.getBase64Data();
                if (base64 != null) {
                    base64List.add(base64);
                    fileTypeList.add(image.getFileType());
                }
            }
            
            response.setImageBase64List(base64List);
            response.setImageFileTypeList(fileTypeList);
        }
        
        // Calculate rating summary
        if (item.getRatings() != null && !item.getRatings().isEmpty()) {
            DoubleSummaryStatistics stats = item.getRatings().stream()
                .mapToDouble(RatingReview::getRating)
                .summaryStatistics();
            
            response.setAverageRating(Math.round(stats.getAverage() * 10.0) / 10.0);
            response.setRatingCount(stats.getCount());
        } else {
            response.setAverageRating(0.0);
            response.setRatingCount(0L);
        }
        
        // Check if current user has rated (if authenticated)
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                String username = auth.getName();
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    // Get customer from user using repository (User doesn't have direct Customer reference)
                    Optional<Customer> customerOpt = customerRepository.findByUser_IdAndIsDeletedFalse(user.getId());
                    if (customerOpt.isPresent()) {
                        Customer customer = customerOpt.get();
                        Optional<RatingReview> userRating = ratingReviewService
                            .getCustomerRatingForItem(customer.getId(), item.getId());
                        response.setHasUserRated(userRating.isPresent());
                    } else {
                        response.setHasUserRated(false);
                    }
                } else {
                    response.setHasUserRated(false);
                }
            } else {
                response.setHasUserRated(false);
            }
        } catch (Exception e) {
            // Not authenticated or error - set to false
            response.setHasUserRated(false);
        }
        
        return response;
    }
}

