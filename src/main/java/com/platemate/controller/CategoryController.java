package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.platemate.dto.CategoryDtos;
import com.platemate.enums.ImageType;
import com.platemate.model.Category;
import com.platemate.service.CategoryService;
import com.platemate.service.ImageService;


@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService service;
    
    @Autowired
    private ImageService imageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVIDER', 'CUSTOMER')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CategoryDtos.Response>> listCategories() {
        List<CategoryDtos.Response> data = service.getCatogaries().stream().map(this::toResponse).toList();
        return ResponseEntity.ok(data);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDtos.Response> createCategory(
            @RequestPart("data") CategoryDtos.CreateRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        Category category = new Category();
        category.setCategoryName(req.getCategoryName());
        category.setDescription(req.getDescription());
        Category saved = service.createCategory(category);
        
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, ImageType.CATEGORY, saved.getId());
            // Reload category with image after saving
            saved = service.findActiveById(saved.getId()).orElse(saved);
        }
        
        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDtos.Response> updateCategory(
            @PathVariable Long id,
            @RequestPart("data") CategoryDtos.UpdateRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        Category update = new Category();
        update.setCategoryName(req.getCategoryName());
        update.setDescription(req.getDescription());
        Category saved = service.updateCategory(id, update);
        
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, ImageType.CATEGORY, saved.getId());
            // Reload category with image after saving
            saved = service.findActiveById(saved.getId()).orElse(saved);
        }
        
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVIDER', 'CUSTOMER')")
    @Transactional(readOnly = true)
    public ResponseEntity<CategoryDtos.Response> getById(@PathVariable Long id) {
        return service.findActiveById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    private CategoryDtos.Response toResponse(Category category) {
        CategoryDtos.Response res = new CategoryDtos.Response();
        res.setId(category.getId());
        res.setCategoryName(category.getCategoryName());
        res.setDescription(category.getDescription());
        
        // Set image base64 data if image exists
        if (category.getCategoryImage() != null) {
            com.platemate.model.Image image = category.getCategoryImage();
            // Access base64Data to ensure it's loaded
            String base64Data = image.getBase64Data();
            res.setImageBase64(base64Data);
            res.setImageFileType(image.getFileType());
        }
        
        return res;
    }
}