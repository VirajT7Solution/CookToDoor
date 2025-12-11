package com.platemate.model;

import java.util.List;

import com.platemate.enums.MealType;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
@AttributeOverride(name = "id", column = @Column(name = "item_id"))
public class MenuItem extends BaseEntity {

    // ---------------- Relationships ----------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private TiffinProvider provider; // FK → tiffin_providers.provider_id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // FK → categories.category_id

    // ---------------- Other fields ----------------

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "units_of_measurement")
    private Double unitsOfMeasurement; // Weight in grams (always in grams)

    @Column(name = "max_quantity")
    private Integer maxQuantity; // Maximum quantity a customer can order

    @Transient
    private List<RatingReview> ratings;

    @Transient
    private List<Image> images;

    public MenuItem() {
    }

    public MenuItem(TiffinProvider provider, Category category, String itemName, String description,
            Double price, String ingredients, MealType mealType, Boolean isAvailable, String imageUrl,
            Boolean isDeleted) {
        this.provider = provider;
        this.category = category;
        this.itemName = itemName;
        this.description = description;
        this.price = price;
        this.ingredients = ingredients;
        this.mealType = mealType;
        this.isAvailable = isAvailable;
        this.isDeleted = isDeleted;
    }

    public TiffinProvider getProvider() {
        return provider;
    }

    public void setProvider(TiffinProvider provider) {
        this.provider = provider;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public MealType getMealType() {
        return mealType;
    }

    public void setMealType(MealType mealType) {
        this.mealType = mealType;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public List<RatingReview> getRatings() {
        return ratings;
    }

    public void setRatings(List<RatingReview> ratings) {
        this.ratings = ratings;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public Double getUnitsOfMeasurement() {
        return unitsOfMeasurement;
    }

    public void setUnitsOfMeasurement(Double unitsOfMeasurement) {
        this.unitsOfMeasurement = unitsOfMeasurement;
    }

    public Integer getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Integer maxQuantity) {
        this.maxQuantity = maxQuantity;
    }
}
