package com.platemate.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.enums.MealType;
import com.platemate.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    java.util.List<MenuItem> findAllByProvider_IdAndIsDeletedFalse(Long providerId);
    
    // Eagerly load category for provider's own products
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT mi FROM MenuItem mi WHERE mi.provider.id = :providerId AND mi.isDeleted = false")
    java.util.List<MenuItem> findAllByProvider_IdAndIsDeletedFalseWithCategory(@Param("providerId") Long providerId);
    
    // Customer-facing queries - only available and non-deleted items from verified providers
    // Using @EntityGraph to eagerly load provider and category relationships
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true")
    Page<MenuItem> findAvailableMenuItems(Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND mi.provider.id = :providerId")
    Page<MenuItem> findAvailableMenuItemsByProvider(@Param("providerId") Long providerId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND mi.category.id = :categoryId")
    Page<MenuItem> findAvailableMenuItemsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND mi.mealType = :mealType")
    Page<MenuItem> findAvailableMenuItemsByMealType(@Param("mealType") MealType mealType, Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND (LOWER(mi.itemName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(mi.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<MenuItem> searchAvailableMenuItems(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND mi.provider.id = :providerId " +
           "AND mi.category.id = :categoryId")
    Page<MenuItem> findAvailableMenuItemsByProviderAndCategory(
            @Param("providerId") Long providerId, 
            @Param("categoryId") Long categoryId, 
            Pageable pageable);
    
    @EntityGraph(attributePaths = {"provider", "provider.user", "category"})
    @Query("SELECT mi FROM MenuItem mi " +
           "WHERE mi.isDeleted = false " +
           "AND mi.isAvailable = true " +
           "AND mi.provider.isDeleted = false " +
           "AND mi.provider.isVerified = true " +
           "AND mi.id = :itemId")
    java.util.Optional<MenuItem> findAvailableMenuItemById(@Param("itemId") Long itemId);
    
    // Count queries for dashboard stats (avoids loading entities and selecting max_quantity column)
    long countByIsDeletedFalse();
    
    long countByIsDeletedFalseAndIsAvailableTrue();
}
