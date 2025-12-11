package com.platemate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
@AttributeOverride(name = "id", column = @Column(name = "category_id"))
public class Category extends BaseEntity {

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Transient
    private Image categoryImage;

    public Category() {}

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Image getCategoryImage() { return categoryImage; }
    public void setCategoryImage(Image categoryImage) { this.categoryImage = categoryImage; }
}