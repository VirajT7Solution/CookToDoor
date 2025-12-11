package com.platemate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.enums.ImageType;
import com.platemate.enums.MealType;
import com.platemate.enums.RatingType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.MenuItem;
import com.platemate.repository.CategoryRepository;
import com.platemate.repository.ImageRepository;
import com.platemate.repository.MenuItemRepository;
import com.platemate.repository.RatingReviewRepository;

@Service
public class MenuItemService {
    
    @Autowired
    MenuItemRepository menuItemRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    RatingReviewRepository ratingReviewRepository;

    public List<MenuItem> getAllMenuItems() {
        List<MenuItem> items = menuItemRepository.findAll();
        items.forEach(this::loadExtras);
        return items;
    }

    public MenuItem updateMenuItem(Long id, MenuItem updatedItem) {
        return menuItemRepository.findById(id).map(item -> {
            item.setCategory(updatedItem.getCategory());
            item.setDescription(updatedItem.getDescription());
            item.setItemName(updatedItem.getItemName());
            item.setIngredients(updatedItem.getIngredients());
            item.setMealType(updatedItem.getMealType());
            item.setPrice(updatedItem.getPrice());
            MenuItem saved = menuItemRepository.save(item);
            loadExtras(saved);
            return saved;
        }).orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + id));
    }

    // Customer-facing methods with pagination
    @Transactional(readOnly = true)
    public Page<MenuItem> getAvailableMenuItems(Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.findAvailableMenuItems(pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<MenuItem> getAvailableMenuItemsByProvider(Long providerId, Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.findAvailableMenuItemsByProvider(providerId, pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<MenuItem> getAvailableMenuItemsByCategory(Long categoryId, Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.findAvailableMenuItemsByCategory(categoryId, pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<MenuItem> getAvailableMenuItemsByMealType(MealType mealType, Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.findAvailableMenuItemsByMealType(mealType, pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<MenuItem> searchAvailableMenuItems(String searchTerm, Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.searchAvailableMenuItems(searchTerm, pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<MenuItem> getAvailableMenuItemsByProviderAndCategory(Long providerId, Long categoryId, Pageable pageable) {
        Page<MenuItem> page = menuItemRepository.findAvailableMenuItemsByProviderAndCategory(providerId, categoryId, pageable);
        page.getContent().forEach(this::loadExtras);
        return page;
    }

    @Transactional(readOnly = true)
    public MenuItem getAvailableMenuItemById(Long itemId) {
        MenuItem item = menuItemRepository.findAvailableMenuItemById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found or not available"));
        loadExtras(item);
        return item;
    }

    // ---------------- Load product images and ratings ---------------- 
    @Transactional(readOnly = true)
    private void loadExtras(MenuItem menuItem) {
        // Load images
        List<com.platemate.model.Image> images = imageRepository.findAllByImageTypeAndOwnerId(
                ImageType.PRODUCT, menuItem.getId());
        // Explicitly access base64Data to force loading within transaction
        images.forEach(image -> {
            String base64 = image.getBase64Data();
            if (base64 != null) {
                // Force load by accessing the data
                base64.length();
            }
        });
        menuItem.setImages(images);
        
        // Load ratings (only non-deleted)
        List<com.platemate.model.RatingReview> ratings = ratingReviewRepository
                .findByRatingTypeAndTargetId(RatingType.ITEM_RATING, menuItem.getId());
        // Filter out deleted ratings
        List<com.platemate.model.RatingReview> activeRatings = ratings.stream()
                .filter(r -> !Boolean.TRUE.equals(r.getIsDeleted()))
                .toList();
        menuItem.setRatings(activeRatings);
    }
    
    // Method to find menu item by ID and load extras (for provider's own items)
    @Transactional(readOnly = true)
    public java.util.Optional<MenuItem> findByIdWithExtras(Long id) {
        return menuItemRepository.findById(id).map(item -> {
            loadExtras(item);
            return item;
        });
    }

    // Public method to load extras for a menu item (used by controllers)
    public void loadMenuItemExtras(MenuItem menuItem) {
        loadExtras(menuItem);
    }
}
