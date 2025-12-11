package com.platemate.dto;

import com.platemate.enums.MealType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MenuItemDtos {

    public static class CreateRequest {
        @NotNull(message = "Category ID is required")
        private Long categoryId;
        
        @NotBlank(message = "Item name is required")
        @Size(max = 255, message = "Item name must not exceed 255 characters")
        private String itemName;
        
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        private String description;
        
        @NotNull(message = "Price is required")
        @Min(value = 0, message = "Price must be positive or zero")
        private Double price;
        
        @Size(max = 1000, message = "Ingredients must not exceed 1000 characters")
        private String ingredients;
        
        @NotNull(message = "Meal type is required")
        private MealType mealType;
        
        private Boolean isAvailable;
        
        @NotNull(message = "Units of measurement (in grams) is required")
        @Min(value = 0, message = "Units of measurement must be positive or zero")
        private Double unitsOfMeasurement; // Weight in grams
        
        @NotNull(message = "Max quantity is required")
        @Min(value = 1, message = "Max quantity must be at least 1")
        private Integer maxQuantity;
        
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getIngredients() { return ingredients; }
        public void setIngredients(String ingredients) { this.ingredients = ingredients; }
        public MealType getMealType() { return mealType; }
        public void setMealType(MealType mealType) { this.mealType = mealType; }
        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
        public Double getUnitsOfMeasurement() { return unitsOfMeasurement; }
        public void setUnitsOfMeasurement(Double unitsOfMeasurement) { this.unitsOfMeasurement = unitsOfMeasurement; }
        public Integer getMaxQuantity() { return maxQuantity; }
        public void setMaxQuantity(Integer maxQuantity) { this.maxQuantity = maxQuantity; }
    }

    public static class UpdateRequest {
        private Long categoryId;
        private String itemName;
        private String description;
        private Double price;
        private String ingredients;
        private MealType mealType;
        private Boolean isAvailable;
        
        @Min(value = 0, message = "Units of measurement must be positive or zero")
        private Double unitsOfMeasurement; // Weight in grams (optional for partial update)
        
        @Min(value = 1, message = "Max quantity must be at least 1")
        private Integer maxQuantity; // Optional for partial update
        
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getIngredients() { return ingredients; }
        public void setIngredients(String ingredients) { this.ingredients = ingredients; }
        public MealType getMealType() { return mealType; }
        public void setMealType(MealType mealType) { this.mealType = mealType; }
        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
        public Double getUnitsOfMeasurement() { return unitsOfMeasurement; }
        public void setUnitsOfMeasurement(Double unitsOfMeasurement) { this.unitsOfMeasurement = unitsOfMeasurement; }
        public Integer getMaxQuantity() { return maxQuantity; }
        public void setMaxQuantity(Integer maxQuantity) { this.maxQuantity = maxQuantity; }
    }

    public static class Response {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String itemName;
        private String description;
        private Double price;
        private String ingredients;
        private MealType mealType;
        private Boolean isAvailable;
        private Double unitsOfMeasurement; // Weight in grams
        private Integer maxQuantity;
        private java.util.List<String> imageBase64List;
        private java.util.List<String> imageFileTypeList;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getIngredients() { return ingredients; }
        public void setIngredients(String ingredients) { this.ingredients = ingredients; }
        public MealType getMealType() { return mealType; }
        public void setMealType(MealType mealType) { this.mealType = mealType; }
        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
        public java.util.List<String> getImageBase64List() { return imageBase64List; }
        public void setImageBase64List(java.util.List<String> imageBase64List) { this.imageBase64List = imageBase64List; }
        public java.util.List<String> getImageFileTypeList() { return imageFileTypeList; }
        public void setImageFileTypeList(java.util.List<String> imageFileTypeList) { this.imageFileTypeList = imageFileTypeList; }
        public Double getUnitsOfMeasurement() { return unitsOfMeasurement; }
        public void setUnitsOfMeasurement(Double unitsOfMeasurement) { this.unitsOfMeasurement = unitsOfMeasurement; }
        public Integer getMaxQuantity() { return maxQuantity; }
        public void setMaxQuantity(Integer maxQuantity) { this.maxQuantity = maxQuantity; }
    }

    // Customer-facing DTOs with provider information
    public static class CustomerResponse {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String itemName;
        private String description;
        private Double price;
        private String ingredients;
        private MealType mealType;
        private Double unitsOfMeasurement; // Weight in grams
        private Integer maxQuantity;
        private Long providerId;
        private String providerName;
        private String providerBusinessName;
        private java.util.List<String> imageBase64List;
        private java.util.List<String> imageFileTypeList;
        private Double averageRating;
        private Long ratingCount;
        private Boolean hasUserRated;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getIngredients() { return ingredients; }
        public void setIngredients(String ingredients) { this.ingredients = ingredients; }
        public MealType getMealType() { return mealType; }
        public void setMealType(MealType mealType) { this.mealType = mealType; }
        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }
        public String getProviderName() { return providerName; }
        public void setProviderName(String providerName) { this.providerName = providerName; }
        public String getProviderBusinessName() { return providerBusinessName; }
        public void setProviderBusinessName(String providerBusinessName) { this.providerBusinessName = providerBusinessName; }
        public java.util.List<String> getImageBase64List() { return imageBase64List; }
        public void setImageBase64List(java.util.List<String> imageBase64List) { this.imageBase64List = imageBase64List; }
        public java.util.List<String> getImageFileTypeList() { return imageFileTypeList; }
        public void setImageFileTypeList(java.util.List<String> imageFileTypeList) { this.imageFileTypeList = imageFileTypeList; }
        public Double getUnitsOfMeasurement() { return unitsOfMeasurement; }
        public void setUnitsOfMeasurement(Double unitsOfMeasurement) { this.unitsOfMeasurement = unitsOfMeasurement; }
        public Integer getMaxQuantity() { return maxQuantity; }
        public void setMaxQuantity(Integer maxQuantity) { this.maxQuantity = maxQuantity; }
        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
        public Long getRatingCount() { return ratingCount; }
        public void setRatingCount(Long ratingCount) { this.ratingCount = ratingCount; }
        public Boolean getHasUserRated() { return hasUserRated; }
        public void setHasUserRated(Boolean hasUserRated) { this.hasUserRated = hasUserRated; }
    }

    public static class PaginatedResponse<T> {
        private java.util.List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrevious;
        private boolean isFirst;
        private boolean isLast;

        public PaginatedResponse(org.springframework.data.domain.Page<T> page) {
            this.content = page.getContent();
            this.page = page.getNumber();
            this.size = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
            this.hasNext = page.hasNext();
            this.hasPrevious = page.hasPrevious();
            this.isFirst = page.isFirst();
            this.isLast = page.isLast();
        }

        public java.util.List<T> getContent() { return content; }
        public void setContent(java.util.List<T> content) { this.content = content; }
        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
        public long getTotalElements() { return totalElements; }
        public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public boolean isHasNext() { return hasNext; }
        public void setHasNext(boolean hasNext) { this.hasNext = hasNext; }
        public boolean isHasPrevious() { return hasPrevious; }
        public void setHasPrevious(boolean hasPrevious) { this.hasPrevious = hasPrevious; }
        public boolean isFirst() { return isFirst; }
        public void setFirst(boolean first) { isFirst = first; }
        public boolean isLast() { return isLast; }
        public void setLast(boolean last) { isLast = last; }
    }
}


