package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;

import com.platemate.dto.MenuItemDtos;
import com.platemate.enums.ImageType;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ForbiddenException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Category;
import com.platemate.model.Image;
import com.platemate.model.MenuItem;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.CategoryRepository;
import com.platemate.repository.MenuItemRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.ImageService;
import com.platemate.service.MenuItemService;

@RestController
@RequestMapping("/api/providers/menu-items")
@PreAuthorize("hasRole('PROVIDER')")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private TiffinProviderRepository providerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageService imageService;
    @Autowired
    private MenuItemService menuItemService;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private TiffinProvider currentProviderOrThrow() {
        User user = currentUser();
        TiffinProvider provider = providerRepository.findByUser_Id(user.getId());
        if (provider == null) {
            throw new ResourceNotFoundException("Provider profile not found for user");
        }
        if (!Boolean.TRUE.equals(provider.getIsVerified())) {
            throw new ForbiddenException("Provider is not approved yet");
        }
        return provider;
    }

    @Transactional
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDtos.Response> create(
            @RequestPart("data") @Valid MenuItemDtos.CreateRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        TiffinProvider provider = currentProviderOrThrow();
        
        // Validate image if provided
        if (image != null && !image.isEmpty()) {
            validateImage(image);
        }
        
        Category category = categoryRepository.findById(data.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        MenuItem item = new MenuItem();
        item.setProvider(provider);
        item.setCategory(category);
        item.setItemName(data.getItemName());
        item.setDescription(data.getDescription());
        item.setPrice(data.getPrice());
        item.setIngredients(data.getIngredients());
        item.setMealType(data.getMealType());
        item.setIsAvailable(data.getIsAvailable() != null ? data.getIsAvailable() : Boolean.TRUE);
        item.setUnitsOfMeasurement(data.getUnitsOfMeasurement());
        item.setMaxQuantity(data.getMaxQuantity());
        item.setIsDeleted(false);
        MenuItem saved = menuItemRepository.save(item);
        if (image != null && !image.isEmpty()) {
            try {
                Image savedImage = imageService.saveImage(image, ImageType.PRODUCT, saved.getId());
                // Reload menu item with image after saving
                saved = menuItemService.findByIdWithExtras(saved.getId()).orElse(saved);
            } catch (Exception e) {
                // Log the error but don't fail the request
                System.err.println("Error saving menu item image: " + e.getMessage());
                e.printStackTrace();
                // Still load extras even if image save failed
                menuItemService.loadMenuItemExtras(saved);
            }
        } else {
            menuItemService.loadMenuItemExtras(saved);
        }
        return ResponseEntity.ok(toResponse(saved));
    }
    
    private void validateImage(MultipartFile image) {
        if (image.isEmpty()) {
            throw new BadRequestException("Image file is empty");
        }
        
        // Check content type
        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image. Received content type: " + contentType);
        }
        
        // Check file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (image.getSize() > maxSize) {
            throw new BadRequestException("Image size must not exceed 5MB. Current size: " + (image.getSize() / 1024) + "KB");
        }
    }

    @Transactional(readOnly = true)
    @GetMapping
    public ResponseEntity<List<MenuItemDtos.Response>> listMine() {
        TiffinProvider provider = currentProviderOrThrow();
        List<MenuItem> menuItems = menuItemRepository
                .findAllByProvider_IdAndIsDeletedFalse(provider.getId());
        menuItems.forEach(menuItemService::loadMenuItemExtras);
        // Access LOB data while still in transaction
        List<MenuItemDtos.Response> items = menuItems.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(items);
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDtos.Response> getMine(@PathVariable Long id) {
        TiffinProvider provider = currentProviderOrThrow();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        if (!item.getProvider().getId().equals(provider.getId())) {
            throw new ForbiddenException("Cannot access another provider's item");
        }
        menuItemService.loadMenuItemExtras(item);
        // Access LOB data while still in transaction
        return ResponseEntity.ok(toResponse(item));
    }

    @Transactional
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDtos.Response> update(
            @PathVariable Long id,
            @RequestPart("data") @Valid MenuItemDtos.UpdateRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        TiffinProvider provider = currentProviderOrThrow();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        if (!item.getProvider().getId().equals(provider.getId())) {
            throw new ForbiddenException("Cannot modify another provider's item");
        }
        if (data.getCategoryId() != null) {
            Category category = categoryRepository.findById(data.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            item.setCategory(category);
        }
        if (data.getDescription() != null) item.setDescription(data.getDescription());
        if (data.getItemName() != null) item.setItemName(data.getItemName());
        if (data.getIngredients() != null) item.setIngredients(data.getIngredients());
        if (data.getMealType() != null) item.setMealType(data.getMealType());
        if (data.getPrice() != null) item.setPrice(data.getPrice());
        if (data.getIsAvailable() != null) item.setIsAvailable(data.getIsAvailable());
        // Update required fields if provided (for partial update)
        if (data.getUnitsOfMeasurement() != null) item.setUnitsOfMeasurement(data.getUnitsOfMeasurement());
        if (data.getMaxQuantity() != null) item.setMaxQuantity(data.getMaxQuantity());
        MenuItem saved = menuItemRepository.save(item);
        if (image != null && !image.isEmpty()) {
            try {
                Image savedImage = imageService.saveImage(image, ImageType.PRODUCT, saved.getId());
                // Reload menu item with image after saving
                saved = menuItemService.findByIdWithExtras(saved.getId()).orElse(saved);
            } catch (Exception e) {
                // Log the error but don't fail the request
                System.err.println("Error saving menu item image: " + e.getMessage());
                e.printStackTrace();
                // Still load extras even if image save failed
                menuItemService.loadMenuItemExtras(saved);
            }
        } else {
            menuItemService.loadMenuItemExtras(saved);
        }
        menuItemService.loadMenuItemExtras(saved);
        // Access LOB data while still in transaction
        return ResponseEntity.ok(toResponse(saved));
    }

    @Transactional
    @PatchMapping("/{id}/availability")
    public ResponseEntity<MenuItemDtos.Response> toggleAvailability(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> req) {
        TiffinProvider provider = currentProviderOrThrow();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        if (!item.getProvider().getId().equals(provider.getId())) {
            throw new ForbiddenException("Cannot modify another provider's item");
        }
        Boolean available = req.get("available");
        if (available != null) {
            item.setIsAvailable(available);
        }
        MenuItem saved = menuItemRepository.save(item);
        menuItemService.loadMenuItemExtras(saved);
        // Access LOB data while still in transaction
        return ResponseEntity.ok(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        TiffinProvider provider = currentProviderOrThrow();
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        if (!item.getProvider().getId().equals(provider.getId())) {
            throw new ForbiddenException("Cannot modify another provider's item");
        }
        item.setIsDeleted(true);
        menuItemRepository.save(item);
        return ResponseEntity.noContent().build();
    }

    private MenuItemDtos.Response toResponse(MenuItem item) {
        MenuItemDtos.Response res = new MenuItemDtos.Response();
        res.setId(item.getId());
        if (item.getCategory() != null) {
            res.setCategoryId(item.getCategory().getId());
            res.setCategoryName(item.getCategory().getCategoryName());
        }
        res.setItemName(item.getItemName());
        res.setDescription(item.getDescription());
        res.setPrice(item.getPrice());
        res.setIngredients(item.getIngredients());
        res.setMealType(item.getMealType());
        res.setIsAvailable(item.getIsAvailable());
        res.setUnitsOfMeasurement(item.getUnitsOfMeasurement());
        res.setMaxQuantity(item.getMaxQuantity());
        
        // Map images to base64 lists
        if (item.getImages() != null && !item.getImages().isEmpty()) {
            java.util.List<String> base64List = item.getImages().stream()
                    .map(com.platemate.model.Image::getBase64Data)
                    .toList();
            java.util.List<String> fileTypeList = item.getImages().stream()
                    .map(com.platemate.model.Image::getFileType)
                    .toList();
            res.setImageBase64List(base64List);
            res.setImageFileTypeList(fileTypeList);
        }
        
        return res;
    }
}


