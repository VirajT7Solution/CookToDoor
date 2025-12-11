package com.platemate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.enums.RatingType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Customer;
import com.platemate.model.RatingReview;
import com.platemate.model.User;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.RatingReviewService;

@RestController
@RequestMapping("/api")
public class RatingReviewController {

    @Autowired
    private RatingReviewService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public static class RateProviderRequest {
        public Long orderId;
        public Long providerId;
        public Integer rating;
        public String review;
    }

    public static class RateMenuItemRequest {
        public Long orderId;
        public Long menuItemId;
        public Integer rating;
        public String review;
    }

    public static class SummaryRequest {
        public RatingType type;
        public Long targetId;
    }

    public static class ReviewResponse {
        public Long reviewId;
        public Integer rating;
        public String reviewText;
        public String customerName;
        public java.time.LocalDateTime createdAt;
        
        public ReviewResponse(RatingReview review) {
            this.reviewId = review.getId();
            this.rating = review.getRating();
            this.reviewText = review.getReviewText();
            if (review.getCustomer() != null) {
                this.customerName = review.getCustomer().getFullName();
            }
            this.createdAt = review.getCreatedAt();
        }
    }

    @PostMapping("/customers/ratings/provider")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> rateProvider(@RequestBody RateProviderRequest req) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(service.rateProvider(customerId, req.orderId, req.providerId, req.rating, req.review));
    }

    @PostMapping("/customers/ratings/menu-item")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> rateMenuItem(@RequestBody RateMenuItemRequest req) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(service.rateMenuItem(customerId, req.orderId, req.menuItemId, req.rating, req.review));
    }

    @GetMapping("/ratings/summary")
    public ResponseEntity<?> summary(@RequestParam RatingType type, @RequestParam Long targetId) {
        return ResponseEntity.ok(service.getSummary(type, targetId));
    }

    @GetMapping("/ratings/menu-item/{menuItemId}")
    public ResponseEntity<List<ReviewResponse>> getMenuItemReviews(@PathVariable Long menuItemId) {
        List<RatingReview> reviews = service.getMenuItemReviews(menuItemId);
        List<ReviewResponse> responses = reviews.stream()
                .map(ReviewResponse::new)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ratings/menu-item/{menuItemId}/summary")
    public ResponseEntity<?> getMenuItemRatingSummary(@PathVariable Long menuItemId) {
        return ResponseEntity.ok(service.getSummary(RatingType.ITEM_RATING, menuItemId));
    }

    @GetMapping("/customers/ratings/menu-item/{menuItemId}/rateable-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getRateableOrders(@PathVariable Long menuItemId) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(service.getRateableOrdersForMenuItem(customerId, menuItemId));
    }


    private Long getCurrentCustomerId() {
        User user = getCurrentUser();
        Customer customer = customerRepository.findByUser_IdAndIsDeletedFalse(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user"));
        return customer.getId();
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}


