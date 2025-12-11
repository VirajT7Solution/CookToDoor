package com.platemate.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.dto.DashboardStatsDto;
import com.platemate.enums.OrderStatus;
import com.platemate.enums.PaymentStatus;
import com.platemate.enums.PayoutStatus;
import com.platemate.enums.RatingType;
import com.platemate.enums.Role;
import com.platemate.model.Cart;
import com.platemate.model.Customer;
import com.platemate.model.DeliveryPartner;
import com.platemate.model.Order;
import com.platemate.model.Payment;
import com.platemate.model.Payout;
import com.platemate.model.PayoutTransaction;
import com.platemate.model.RatingReview;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.CartRepository;
import com.platemate.repository.CategoryRepository;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.DeliveryPartnerRepository;
import com.platemate.repository.MenuItemRepository;
import com.platemate.repository.OrderRepository;
import com.platemate.repository.PaymentRepository;
import com.platemate.repository.PayoutRepository;
import com.platemate.repository.PayoutTransactionRepository;
import com.platemate.repository.RatingReviewRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private PayoutTransactionRepository payoutTransactionRepository;

    @Autowired
    private RatingReviewRepository ratingReviewRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        
        // Initialize all values to defaults to ensure we always return valid data
        initializeDefaults(stats);

        try {
            // User Statistics
            calculateUserStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating user stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Order Statistics
            calculateOrderStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating order stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Payment Statistics
            calculatePaymentStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating payment stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Provider Statistics
            calculateProviderStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating provider stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Delivery Partner Statistics
            calculateDeliveryPartnerStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating delivery partner stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Category & Menu Statistics
            calculateCategoryAndMenuStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating category and menu stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Payout Statistics
            calculatePayoutStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating payout stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Rating & Review Statistics
            calculateRatingAndReviewStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating rating and review stats: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            // Cart Statistics
            calculateCartStats(stats);
        } catch (Exception e) {
            System.err.println("Error calculating cart stats: " + e.getMessage());
            e.printStackTrace();
        }

        return stats;
    }

    private void calculateUserStats(DashboardStatsDto stats) {
        // Total users (excluding deleted)
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.stream()
                .filter(u -> u.isActive())
                .count();
        stats.setTotalUsers(totalUsers);

        // Total customers
        List<Customer> customers = customerRepository.findAllByIsDeletedFalse();
        stats.setTotalCustomers((long) customers.size());

        // Total providers (verified)
        List<TiffinProvider> verifiedProviders = tiffinProviderRepository.findAllByIsVerified(true);
        stats.setTotalProviders((long) verifiedProviders.size());

        // Total delivery partners (users with DELIVERY_PARTNER role)
        long deliveryPartnerUsers = allUsers.stream()
                .filter(u -> u.getRole() == Role.ROLE_DELIVERY_PARTNER)
                .filter(u -> u.isActive())
                .count();
        stats.setTotalDeliveryPartners(deliveryPartnerUsers);

        // Pending providers
        List<TiffinProvider> pendingProviders = tiffinProviderRepository.findAllByIsVerified(false);
        stats.setPendingProviders((long) pendingProviders.size());
    }

    private void calculateOrderStats(DashboardStatsDto stats) {
        // Get all non-deleted orders
        List<Order> allOrders = orderRepository.findAllByIsDeletedFalse();
        if (allOrders == null) {
            allOrders = new ArrayList<>();
        }

        stats.setTotalOrders((long) allOrders.size());

        // Orders by status
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = allOrders.stream()
                    .filter(o -> o.getOrderStatus() != null && o.getOrderStatus() == status)
                    .count();
            ordersByStatus.put(status.name(), count);
        }
        stats.setOrdersByStatus(ordersByStatus);

        // Time-based order counts
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDate today = LocalDate.now();
        LocalDateTime startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        long todayOrders = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfToday))
                .count();
        stats.setTodayOrders(todayOrders);

        long weekOrders = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfWeek))
                .count();
        stats.setWeekOrders(weekOrders);

        long monthOrders = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfMonth))
                .count();
        stats.setMonthOrders(monthOrders);

        // Revenue calculations
        double totalRevenue = allOrders.stream()
                .filter(o -> o.getTotalAmount() != null)
                .mapToDouble(Order::getTotalAmount)
                .sum();
        stats.setTotalRevenue(totalRevenue);

        double todayRevenue = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfToday))
                .filter(o -> o.getTotalAmount() != null)
                .mapToDouble(Order::getTotalAmount)
                .sum();
        stats.setTodayRevenue(todayRevenue);

        double weekRevenue = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfWeek))
                .filter(o -> o.getTotalAmount() != null)
                .mapToDouble(Order::getTotalAmount)
                .sum();
        stats.setWeekRevenue(weekRevenue);

        double monthRevenue = allOrders.stream()
                .filter(o -> o.getOrderTime() != null && o.getOrderTime().isAfter(startOfMonth))
                .filter(o -> o.getTotalAmount() != null)
                .mapToDouble(Order::getTotalAmount)
                .sum();
        stats.setMonthRevenue(monthRevenue);
    }

    private void calculatePaymentStats(DashboardStatsDto stats) {
        // Get all non-deleted payments
        List<Payment> allPayments = paymentRepository.findAllByIsDeletedFalse();
        if (allPayments == null) {
            allPayments = new ArrayList<>();
        }

        stats.setTotalPayments((long) allPayments.size());

        // Payment status counts
        long successfulPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() != null && p.getPaymentStatus() == PaymentStatus.SUCCESS)
                .count();
        stats.setSuccessfulPayments(successfulPayments);

        long pendingPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() != null && p.getPaymentStatus() == PaymentStatus.PENDING)
                .count();
        stats.setPendingPayments(pendingPayments);

        long failedPayments = allPayments.stream()
                .filter(p -> p.getPaymentStatus() != null && p.getPaymentStatus() == PaymentStatus.FAILED)
                .count();
        stats.setFailedPayments(failedPayments);

        // Payment amounts
        double totalPaymentAmount = allPayments.stream()
                .filter(p -> p.getAmount() != null)
                .mapToDouble(Payment::getAmount)
                .sum();
        stats.setTotalPaymentAmount(totalPaymentAmount);

        // Today's payment amount
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        double todayPaymentAmount = allPayments.stream()
                .filter(p -> p.getPaymentTime() != null && p.getPaymentTime().isAfter(startOfToday))
                .filter(p -> p.getAmount() != null)
                .mapToDouble(Payment::getAmount)
                .sum();
        stats.setTodayPaymentAmount(todayPaymentAmount);
    }

    private void calculateProviderStats(DashboardStatsDto stats) {
        List<TiffinProvider> verifiedProviders = tiffinProviderRepository.findAllByIsVerified(true);
        stats.setVerifiedProviders((long) verifiedProviders.size());
    }

    private void calculateDeliveryPartnerStats(DashboardStatsDto stats) {
        List<DeliveryPartner> allPartners = deliveryPartnerRepository.findAllByIsDeletedFalse();

        long availablePartners = allPartners.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsAvailable()))
                .count();
        stats.setAvailableDeliveryPartners(availablePartners);

        long unavailablePartners = allPartners.stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsAvailable()))
                .count();
        stats.setUnavailableDeliveryPartners(unavailablePartners);
    }

    private void calculateCategoryAndMenuStats(DashboardStatsDto stats) {
        // Total categories
        long totalCategories = categoryRepository.count();
        stats.setTotalCategories(totalCategories);

        // Active categories
        List<com.platemate.model.Category> activeCategories = categoryRepository.findAllByIsActiveTrue();
        stats.setActiveCategories((long) activeCategories.size());

        // Total menu items (non-deleted) - using count query to avoid loading entities
        long totalMenuItems = menuItemRepository.countByIsDeletedFalse();
        stats.setTotalMenuItems(totalMenuItems);

        // Available menu items (non-deleted and available) - using count query to avoid loading entities
        long availableMenuItems = menuItemRepository.countByIsDeletedFalseAndIsAvailableTrue();
        stats.setAvailableMenuItems(availableMenuItems);
    }

    private void calculatePayoutStats(DashboardStatsDto stats) {
        // Get all payout transactions (for history stats)
        List<PayoutTransaction> allTransactions = payoutTransactionRepository.findAllByIsDeletedFalseOrderByProcessedAtDesc();
        if (allTransactions == null) {
            allTransactions = new ArrayList<>();
        }

        stats.setTotalPayouts((long) allTransactions.size());

        // Payouts by status
        Map<String, Long> payoutsByStatus = new HashMap<>();
        for (PayoutStatus status : PayoutStatus.values()) {
            long count = allTransactions.stream()
                    .filter(t -> t.getStatus() != null && t.getStatus() == status)
                    .count();
            payoutsByStatus.put(status.name(), count);
        }
        stats.setPayoutsByStatus(payoutsByStatus);

        // Total payout amount (sum of all completed transactions)
        double totalPayoutAmount = allTransactions.stream()
                .filter(t -> t.getStatus() == PayoutStatus.COMPLETED && t.getAmount() != null)
                .mapToDouble(PayoutTransaction::getAmount)
                .sum();
        stats.setTotalPayoutAmount(Math.round(totalPayoutAmount * 100.0) / 100.0);

        // Total commission deducted (calculate from orders - sum of platformCommission from delivered orders)
        double totalCommissionDeducted = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED && 
                            !Boolean.TRUE.equals(o.getIsDeleted()) &&
                            o.getPlatformCommission() != null)
                .mapToDouble(Order::getPlatformCommission)
                .sum();
        stats.setTotalCommissionDeducted(Math.round(totalCommissionDeducted * 100.0) / 100.0);

        // Today's payouts (transactions processed today)
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long todayPayouts = allTransactions.stream()
                .filter(t -> t.getProcessedAt() != null && t.getProcessedAt().isAfter(startOfToday))
                .count();
        stats.setTodayPayouts(todayPayouts);
    }

    private void calculateRatingAndReviewStats(DashboardStatsDto stats) {
        // Get all non-deleted reviews
        List<RatingReview> allReviews = ratingReviewRepository.findAllByIsDeletedFalse();
        if (allReviews == null) {
            allReviews = new ArrayList<>();
        }

        stats.setTotalReviews((long) allReviews.size());

        // Average rating
        if (!allReviews.isEmpty()) {
            double averageRating = allReviews.stream()
                    .filter(r -> r.getRating() != null)
                    .mapToInt(RatingReview::getRating)
                    .average()
                    .orElse(0.0);
            stats.setAverageRating(Math.round(averageRating * 10.0) / 10.0); // Round to 1 decimal
        } else {
            stats.setAverageRating(0.0);
        }

        // Reviews by type
        Map<String, Long> reviewsByType = new HashMap<>();
        for (RatingType type : RatingType.values()) {
            long count = allReviews.stream()
                    .filter(r -> r.getRatingType() != null && r.getRatingType() == type)
                    .count();
            reviewsByType.put(type.name(), count);
        }
        stats.setReviewsByType(reviewsByType);

        // Rating distribution (1-5 stars)
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int rating = i;
            long count = allReviews.stream()
                    .filter(r -> r.getRating() != null && r.getRating() == rating)
                    .count();
            ratingDistribution.put(rating, count);
        }
        stats.setRatingDistribution(ratingDistribution);
    }

    private void calculateCartStats(DashboardStatsDto stats) {
        // Get all active (non-deleted) carts
        List<Cart> activeCarts = cartRepository.findAllByIsDeletedFalse();
        if (activeCarts == null) {
            activeCarts = new ArrayList<>();
        }

        stats.setActiveCarts((long) activeCarts.size());

        // Total cart value
        double totalCartValue = activeCarts.stream()
                .filter(c -> c.getItemTotal() != null)
                .mapToDouble(Cart::getItemTotal)
                .sum();
        stats.setTotalCartValue(totalCartValue);
    }
    
    private void initializeDefaults(DashboardStatsDto stats) {
        // Initialize all numeric fields to 0
        stats.setTotalUsers(0L);
        stats.setTotalCustomers(0L);
        stats.setTotalProviders(0L);
        stats.setTotalDeliveryPartners(0L);
        stats.setPendingProviders(0L);
        stats.setTotalOrders(0L);
        stats.setTodayOrders(0L);
        stats.setWeekOrders(0L);
        stats.setMonthOrders(0L);
        stats.setTotalRevenue(0.0);
        stats.setTodayRevenue(0.0);
        stats.setWeekRevenue(0.0);
        stats.setMonthRevenue(0.0);
        stats.setTotalPayments(0L);
        stats.setSuccessfulPayments(0L);
        stats.setPendingPayments(0L);
        stats.setFailedPayments(0L);
        stats.setTotalPaymentAmount(0.0);
        stats.setTodayPaymentAmount(0.0);
        stats.setVerifiedProviders(0L);
        stats.setAvailableDeliveryPartners(0L);
        stats.setUnavailableDeliveryPartners(0L);
        stats.setTotalCategories(0L);
        stats.setActiveCategories(0L);
        stats.setTotalMenuItems(0L);
        stats.setAvailableMenuItems(0L);
        stats.setTotalPayouts(0L);
        stats.setTotalPayoutAmount(0.0);
        stats.setTotalCommissionDeducted(0.0);
        stats.setTodayPayouts(0L);
        stats.setTotalReviews(0L);
        stats.setAverageRating(0.0);
        stats.setActiveCarts(0L);
        stats.setTotalCartValue(0.0);
        
        // Initialize maps
        stats.setOrdersByStatus(new HashMap<>());
        stats.setPayoutsByStatus(new HashMap<>());
        stats.setReviewsByType(new HashMap<>());
        stats.setRatingDistribution(new HashMap<>());
    }
}

