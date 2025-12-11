package com.platemate.dto;

import java.util.Map;

public class DashboardStatsDto {
    
    // User Statistics
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalProviders;
    private Long totalDeliveryPartners;
    private Long pendingProviders;
    
    // Order Statistics
    private Long totalOrders;
    private Map<String, Long> ordersByStatus; // Status -> Count
    private Long todayOrders;
    private Long weekOrders;
    private Long monthOrders;
    private Double totalRevenue;
    private Double todayRevenue;
    private Double weekRevenue;
    private Double monthRevenue;
    
    // Payment Statistics
    private Long totalPayments;
    private Long successfulPayments;
    private Long pendingPayments;
    private Long failedPayments;
    private Double totalPaymentAmount;
    private Double todayPaymentAmount;
    
    // Provider Statistics
    private Long verifiedProviders;
    
    // Delivery Partner Statistics
    private Long availableDeliveryPartners;
    private Long unavailableDeliveryPartners;
    
    // Category & Menu Statistics
    private Long totalCategories;
    private Long activeCategories;
    private Long totalMenuItems;
    private Long availableMenuItems;
    
    // Payout Statistics
    private Long totalPayouts;
    private Map<String, Long> payoutsByStatus; // Status -> Count
    private Double totalPayoutAmount;
    private Double totalCommissionDeducted;
    private Long todayPayouts;
    
    // Rating & Review Statistics
    private Long totalReviews;
    private Double averageRating;
    private Map<String, Long> reviewsByType; // RatingType -> Count
    private Map<Integer, Long> ratingDistribution; // Rating (1-5) -> Count
    
    // Cart Statistics
    private Long activeCarts;
    private Double totalCartValue;
    
    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public Long getTotalCustomers() {
        return totalCustomers;
    }
    
    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }
    
    public Long getTotalProviders() {
        return totalProviders;
    }
    
    public void setTotalProviders(Long totalProviders) {
        this.totalProviders = totalProviders;
    }
    
    public Long getTotalDeliveryPartners() {
        return totalDeliveryPartners;
    }
    
    public void setTotalDeliveryPartners(Long totalDeliveryPartners) {
        this.totalDeliveryPartners = totalDeliveryPartners;
    }
    
    public Long getPendingProviders() {
        return pendingProviders;
    }
    
    public void setPendingProviders(Long pendingProviders) {
        this.pendingProviders = pendingProviders;
    }
    
    public Long getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public Map<String, Long> getOrdersByStatus() {
        return ordersByStatus;
    }
    
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) {
        this.ordersByStatus = ordersByStatus;
    }
    
    public Long getTodayOrders() {
        return todayOrders;
    }
    
    public void setTodayOrders(Long todayOrders) {
        this.todayOrders = todayOrders;
    }
    
    public Long getWeekOrders() {
        return weekOrders;
    }
    
    public void setWeekOrders(Long weekOrders) {
        this.weekOrders = weekOrders;
    }
    
    public Long getMonthOrders() {
        return monthOrders;
    }
    
    public void setMonthOrders(Long monthOrders) {
        this.monthOrders = monthOrders;
    }
    
    public Double getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public Double getTodayRevenue() {
        return todayRevenue;
    }
    
    public void setTodayRevenue(Double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }
    
    public Double getWeekRevenue() {
        return weekRevenue;
    }
    
    public void setWeekRevenue(Double weekRevenue) {
        this.weekRevenue = weekRevenue;
    }
    
    public Double getMonthRevenue() {
        return monthRevenue;
    }
    
    public void setMonthRevenue(Double monthRevenue) {
        this.monthRevenue = monthRevenue;
    }
    
    public Long getTotalPayments() {
        return totalPayments;
    }
    
    public void setTotalPayments(Long totalPayments) {
        this.totalPayments = totalPayments;
    }
    
    public Long getSuccessfulPayments() {
        return successfulPayments;
    }
    
    public void setSuccessfulPayments(Long successfulPayments) {
        this.successfulPayments = successfulPayments;
    }
    
    public Long getPendingPayments() {
        return pendingPayments;
    }
    
    public void setPendingPayments(Long pendingPayments) {
        this.pendingPayments = pendingPayments;
    }
    
    public Long getFailedPayments() {
        return failedPayments;
    }
    
    public void setFailedPayments(Long failedPayments) {
        this.failedPayments = failedPayments;
    }
    
    public Double getTotalPaymentAmount() {
        return totalPaymentAmount;
    }
    
    public void setTotalPaymentAmount(Double totalPaymentAmount) {
        this.totalPaymentAmount = totalPaymentAmount;
    }
    
    public Double getTodayPaymentAmount() {
        return todayPaymentAmount;
    }
    
    public void setTodayPaymentAmount(Double todayPaymentAmount) {
        this.todayPaymentAmount = todayPaymentAmount;
    }
    
    public Long getVerifiedProviders() {
        return verifiedProviders;
    }
    
    public void setVerifiedProviders(Long verifiedProviders) {
        this.verifiedProviders = verifiedProviders;
    }
    
    public Long getAvailableDeliveryPartners() {
        return availableDeliveryPartners;
    }
    
    public void setAvailableDeliveryPartners(Long availableDeliveryPartners) {
        this.availableDeliveryPartners = availableDeliveryPartners;
    }
    
    public Long getUnavailableDeliveryPartners() {
        return unavailableDeliveryPartners;
    }
    
    public void setUnavailableDeliveryPartners(Long unavailableDeliveryPartners) {
        this.unavailableDeliveryPartners = unavailableDeliveryPartners;
    }
    
    public Long getTotalCategories() {
        return totalCategories;
    }
    
    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }
    
    public Long getActiveCategories() {
        return activeCategories;
    }
    
    public void setActiveCategories(Long activeCategories) {
        this.activeCategories = activeCategories;
    }
    
    public Long getTotalMenuItems() {
        return totalMenuItems;
    }
    
    public void setTotalMenuItems(Long totalMenuItems) {
        this.totalMenuItems = totalMenuItems;
    }
    
    public Long getAvailableMenuItems() {
        return availableMenuItems;
    }
    
    public void setAvailableMenuItems(Long availableMenuItems) {
        this.availableMenuItems = availableMenuItems;
    }
    
    // Payout Statistics Getters and Setters
    public Long getTotalPayouts() {
        return totalPayouts;
    }
    
    public void setTotalPayouts(Long totalPayouts) {
        this.totalPayouts = totalPayouts;
    }
    
    public Map<String, Long> getPayoutsByStatus() {
        return payoutsByStatus;
    }
    
    public void setPayoutsByStatus(Map<String, Long> payoutsByStatus) {
        this.payoutsByStatus = payoutsByStatus;
    }
    
    public Double getTotalPayoutAmount() {
        return totalPayoutAmount;
    }
    
    public void setTotalPayoutAmount(Double totalPayoutAmount) {
        this.totalPayoutAmount = totalPayoutAmount;
    }
    
    public Double getTotalCommissionDeducted() {
        return totalCommissionDeducted;
    }
    
    public void setTotalCommissionDeducted(Double totalCommissionDeducted) {
        this.totalCommissionDeducted = totalCommissionDeducted;
    }
    
    public Long getTodayPayouts() {
        return todayPayouts;
    }
    
    public void setTodayPayouts(Long todayPayouts) {
        this.todayPayouts = todayPayouts;
    }
    
    // Rating & Review Statistics Getters and Setters
    public Long getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Map<String, Long> getReviewsByType() {
        return reviewsByType;
    }
    
    public void setReviewsByType(Map<String, Long> reviewsByType) {
        this.reviewsByType = reviewsByType;
    }
    
    public Map<Integer, Long> getRatingDistribution() {
        return ratingDistribution;
    }
    
    public void setRatingDistribution(Map<Integer, Long> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }
    
    // Cart Statistics Getters and Setters
    public Long getActiveCarts() {
        return activeCarts;
    }
    
    public void setActiveCarts(Long activeCarts) {
        this.activeCarts = activeCarts;
    }
    
    public Double getTotalCartValue() {
        return totalCartValue;
    }
    
    public void setTotalCartValue(Double totalCartValue) {
        this.totalCartValue = totalCartValue;
    }
}

