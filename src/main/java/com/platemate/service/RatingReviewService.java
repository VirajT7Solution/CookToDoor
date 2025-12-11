package com.platemate.service;

import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platemate.enums.OrderStatus;
import com.platemate.enums.RatingType;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Cart;
import com.platemate.model.Customer;
import com.platemate.model.Order;
import com.platemate.model.RatingReview;
import com.platemate.repository.CartRepository;
import com.platemate.repository.OrderRepository;
import com.platemate.repository.RatingReviewRepository;

@Service
public class RatingReviewService {

    @Autowired
    private RatingReviewRepository ratingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public RatingReview rateProvider(Long customerId, Long orderId, Long providerId, Integer rating, String review) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        Order order = orderRepository.findByIdAndCustomer_IdAndIsDeletedFalse(orderId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("You can rate only after delivery");
        }
        if (!order.getProvider().getId().equals(providerId)) {
            throw new BadRequestException("Order does not belong to this provider");
        }

        RatingReview rr = new RatingReview();
        rr.setCustomer(order.getCustomer());
        rr.setRatingType(RatingType.COOK_RATING);
        rr.setTargetId(providerId);
        rr.setRating(rating);
        rr.setReviewText(review);
        return ratingRepository.save(rr);
    }

    @Transactional
    public RatingReview rateMenuItem(Long customerId, Long orderId, Long menuItemId, Integer rating, String review) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        Order order = orderRepository.findByIdAndCustomer_IdAndIsDeletedFalse(orderId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("You can rate only after delivery");
        }

        // Parse cart item IDs from order
        List<Long> cartItemIds;
        try {
            cartItemIds = objectMapper.readValue(order.getCartItemIds(), new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Invalid order data");
        }

        // Fetch cart items (use findAllById since cart items are soft-deleted after order creation)
        // but we still need to access them for order history and rating validation
        List<Cart> cartItems = cartRepository.findAllById(cartItemIds);
        
        // Check if menu item exists in order
        boolean itemInOrder = cartItems.stream()
                .anyMatch(cart -> cart.getMenuItem() != null && cart.getMenuItem().getId().equals(menuItemId));
        
        if (!itemInOrder) {
            throw new BadRequestException("Menu item not found in this order");
        }

        // Check if already rated
        Optional<RatingReview> existing = ratingRepository
                .findByCustomer_IdAndRatingTypeAndTargetIdAndIsDeletedFalse(
                    customerId, RatingType.ITEM_RATING, menuItemId);
        
        if (existing.isPresent()) {
            throw new BadRequestException("You have already rated this item");
        }

        RatingReview rr = new RatingReview();
        rr.setCustomer(order.getCustomer());
        rr.setRatingType(RatingType.ITEM_RATING);
        rr.setTargetId(menuItemId);
        rr.setRating(rating);
        rr.setReviewText(review);
        return ratingRepository.save(rr);
    }

    @Transactional(readOnly = true)
    public Summary getSummary(RatingType type, Long targetId) {
        List<RatingReview> list = ratingRepository.findByRatingTypeAndTargetId(type, targetId);
        // Filter out deleted reviews
        List<RatingReview> activeReviews = list.stream()
                .filter(r -> !Boolean.TRUE.equals(r.getIsDeleted()))
                .toList();
        if (activeReviews.isEmpty()) return new Summary(0L, 0.0);
        DoubleSummaryStatistics stats = activeReviews.stream()
                .mapToDouble(r -> r.getRating())
                .summaryStatistics();
        double avg = Math.round(stats.getAverage() * 10.0) / 10.0;
        return new Summary(stats.getCount(), avg);
    }

    @Transactional(readOnly = true)
    public List<RatingReview> getMenuItemReviews(Long menuItemId) {
        return ratingRepository.findReviewsWithCustomer(RatingType.ITEM_RATING, menuItemId);
    }

    @Transactional(readOnly = true)
    public Optional<RatingReview> getCustomerRatingForItem(Long customerId, Long menuItemId) {
        return ratingRepository.findByCustomer_IdAndRatingTypeAndTargetIdAndIsDeletedFalse(
            customerId, RatingType.ITEM_RATING, menuItemId);
    }

    /**
     * Get orders that contain a menu item and are delivered, which can be used for rating
     * Returns orders where the customer hasn't rated the item yet
     */
    @Transactional(readOnly = true)
    public List<RateableOrder> getRateableOrdersForMenuItem(Long customerId, Long menuItemId) {
        // Get all delivered orders for the customer
        List<Order> deliveredOrders = orderRepository
                .findAllByCustomer_IdAndOrderStatusAndIsDeletedFalseOrderByOrderTimeDesc(
                    customerId, OrderStatus.DELIVERED);
        
        // Check if customer already rated this item
        Optional<RatingReview> existingRating = ratingRepository
                .findByCustomer_IdAndRatingTypeAndTargetIdAndIsDeletedFalse(
                    customerId, RatingType.ITEM_RATING, menuItemId);
        
        // If already rated, return empty list
        if (existingRating.isPresent()) {
            return List.of();
        }
        
        // Filter orders that contain the menu item
        return deliveredOrders.stream()
                .filter(order -> {
                    try {
                        List<Long> cartItemIds = objectMapper.readValue(
                                order.getCartItemIds(), new TypeReference<List<Long>>() {});
                        // Use findAllById since cart items are soft-deleted after order creation
                        // but we still need to access them for order history and rating validation
                        List<Cart> cartItems = cartRepository.findAllById(cartItemIds);
                        return cartItems.stream()
                                .anyMatch(cart -> cart.getMenuItem() != null && 
                                        cart.getMenuItem().getId().equals(menuItemId));
                    } catch (JsonProcessingException e) {
                        return false;
                    }
                })
                .map(order -> new RateableOrder(order.getId(), order.getOrderTime()))
                .toList();
    }

    public static class Summary {
        private long count;
        private double average;
        public Summary(long count, double average) { this.count = count; this.average = average; }
        public long getCount() { return count; }
        public double getAverage() { return average; }
    }

    public static class RateableOrder {
        private Long orderId;
        private java.time.LocalDateTime orderTime;
        
        public RateableOrder(Long orderId, java.time.LocalDateTime orderTime) {
            this.orderId = orderId;
            this.orderTime = orderTime;
        }
        
        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }
        public java.time.LocalDateTime getOrderTime() { return orderTime; }
        public void setOrderTime(java.time.LocalDateTime orderTime) { this.orderTime = orderTime; }
    }
}


