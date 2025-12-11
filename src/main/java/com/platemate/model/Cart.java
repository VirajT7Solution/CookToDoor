package com.platemate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
@AttributeOverride(name = "id", column = @Column(name = "cart_item_id"))
public class Cart extends BaseEntity {

    // ---------------- Relationships ----------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer; // FK → customers.customer_id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private MenuItem menuItem; // FK → menu_items.item_id

    // ---------------- Other fields ----------------

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "item_price", nullable = false)
    private Double itemPrice;

    @Column(name = "item_total", nullable = false)
    private Double itemTotal;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    // ---------------- Lifecycle Hooks ----------------

    @PrePersist
    protected void onCreate() {
        if (quantity == null) quantity = 1;
        if (itemTotal == null && itemPrice != null) {
            itemTotal = itemPrice * quantity;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (itemPrice != null && quantity != null) {
            itemTotal = itemPrice * quantity;
        }
    }

    public Cart() {
    }

    public Cart(Customer customer, MenuItem menuItem, Integer quantity, Double itemPrice,
            Double itemTotal, String specialInstructions, Boolean isDeleted) {
        this.customer = customer;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.itemPrice = itemPrice;
        this.itemTotal = itemTotal;
        this.specialInstructions = specialInstructions;
        this.isDeleted = isDeleted;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(Double itemPrice) {
        this.itemPrice = itemPrice;
    }

    public Double getItemTotal() {
        return itemTotal;
    }

    public void setItemTotal(Double itemTotal) {
        this.itemTotal = itemTotal;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
