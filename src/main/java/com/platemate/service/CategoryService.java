package com.platemate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.enums.ImageType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Category;
import com.platemate.model.Image;
import com.platemate.repository.CategoryRepository;
import com.platemate.repository.ImageRepository;

@Service
public class CategoryService {
    
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ImageRepository imageRepository;

    @Transactional
    public Category createCategory(Category category) {
        Category saved = categoryRepository.save(category);
        loadExtras(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Category> getCatogaries() {
        List<Category> categories = categoryRepository.findAllByIsActiveTrue();
        categories.forEach(this::loadExtras);
        return categories;
    }

    @Transactional
    public Category updateCategory(Long id, Category updatedCategory) {
        return categoryRepository.findById(id).map(category -> {
            category.setCategoryName(updatedCategory.getCategoryName());
            category.setDescription(updatedCategory.getDescription());
            Category saved = categoryRepository.save(category);
            loadExtras(saved);
            return saved;
        }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }
    
    public Category softDelete(Long id) {
        return categoryRepository.findById(id).map(category -> {
            category.setActive(false);
            return categoryRepository.save(category);
        }).orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    @Transactional(readOnly = true)
    public java.util.Optional<Category> findActiveById(Long id) {
        java.util.Optional<Category> category = categoryRepository.findById(id).filter(Category::isActive);
        category.ifPresent(this::loadExtras);
        return category;
    }

    // ---------------- Load category image ----------------
    @Transactional(readOnly = true)
    private void loadExtras(Category category) {
        imageRepository.findImageByImageTypeAndOwnerId(ImageType.CATEGORY, category.getId())
                .ifPresent(image -> {
                    // Force load base64Data by accessing it and ensuring it's not null
                    String base64 = image.getBase64Data();
                    if (base64 != null) {
                        // Ensure the data is fully loaded by checking its length
                        base64.length();
                    }
                    category.setCategoryImage(image);
                });
    }
    
}
