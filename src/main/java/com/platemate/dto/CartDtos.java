package com.platemate.dto;

import java.util.List;

public class CartDtos {
    
    public static class CreateRequest {
        private Long menuItemId;
        private Integer quantity;
        private String specialInstructions;
        
        public Long getMenuItemId() {
            return menuItemId;
        }
        
        public void setMenuItemId(Long menuItemId) {
            this.menuItemId = menuItemId;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public String getSpecialInstructions() {
            return specialInstructions;
        }
        
        public void setSpecialInstructions(String specialInstructions) {
            this.specialInstructions = specialInstructions;
        }
    }
    
    public static class UpdateRequest {
        private Integer quantity;
        private String specialInstructions;
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public String getSpecialInstructions() {
            return specialInstructions;
        }
        
        public void setSpecialInstructions(String specialInstructions) {
            this.specialInstructions = specialInstructions;
        }
    }
    
    public static class Response {
        private Long id;
        private Long menuItemId;
        private String itemName;
        private Integer quantity;
        private Double itemPrice;
        private Double itemTotal;
        private String specialInstructions;
        private Long providerId;
        private String providerName;
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public Long getMenuItemId() {
            return menuItemId;
        }
        
        public void setMenuItemId(Long menuItemId) {
            this.menuItemId = menuItemId;
        }
        
        public String getItemName() {
            return itemName;
        }
        
        public void setItemName(String itemName) {
            this.itemName = itemName;
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
        
        public Long getProviderId() {
            return providerId;
        }
        
        public void setProviderId(Long providerId) {
            this.providerId = providerId;
        }
        
        public String getProviderName() {
            return providerName;
        }
        
        public void setProviderName(String providerName) {
            this.providerName = providerName;
        }
    }
    
    public static class CartSummaryResponse {
        private List<Response> items;
        private Double subtotal;
        private Integer totalItems;
        private java.util.Map<Long, List<Response>> groupedByProvider;
        
        public List<Response> getItems() {
            return items;
        }
        
        public void setItems(List<Response> items) {
            this.items = items;
        }
        
        public Double getSubtotal() {
            return subtotal;
        }
        
        public void setSubtotal(Double subtotal) {
            this.subtotal = subtotal;
        }
        
        public Integer getTotalItems() {
            return totalItems;
        }
        
        public void setTotalItems(Integer totalItems) {
            this.totalItems = totalItems;
        }
        
        public java.util.Map<Long, List<Response>> getGroupedByProvider() {
            return groupedByProvider;
        }
        
        public void setGroupedByProvider(java.util.Map<Long, List<Response>> groupedByProvider) {
            this.groupedByProvider = groupedByProvider;
        }
    }
}

