package com.platemate.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platemate.dto.OrderDtos;
import com.platemate.enums.OrderStatus;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ForbiddenException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.enums.PaymentMethod;
import com.platemate.enums.PaymentStatus;
import com.platemate.enums.PaymentType;
import com.platemate.model.Cart;
import com.platemate.model.Customer;
import com.platemate.model.DeliveryPartner;
import com.platemate.model.Order;
import com.platemate.model.Payment;
import com.platemate.model.TiffinProvider;
import com.platemate.repository.CartRepository;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.DeliveryPartnerRepository;
import com.platemate.repository.OrderRepository;
import com.platemate.repository.PaymentRepository;
import com.platemate.repository.TiffinProviderRepository;

@Service
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private CartService cartService;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private PayoutService payoutService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Order createOrder(Long customerId, OrderDtos.CreateRequest req) {
        // Validate customer exists
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        // Validate delivery address
        if (req.getDeliveryAddress() == null || req.getDeliveryAddress().trim().isEmpty()) {
            throw new BadRequestException("Delivery address is required");
        }

        // Validate cart items
        if (req.getCartItemIds() == null || req.getCartItemIds().isEmpty()) {
            throw new BadRequestException("Cart item IDs cannot be empty");
        }

        List<Cart> cartItems = cartService.validateCartItems(customerId, req.getCartItemIds());

        // Validate all items from same provider
        Long providerId = cartItems.get(0).getMenuItem().getProvider().getId();
        for (Cart cart : cartItems) {
            if (!cart.getMenuItem().getProvider().getId().equals(providerId)) {
                throw new BadRequestException("All cart items must be from the same provider");
            }
        }

        // Get provider
        TiffinProvider provider = tiffinProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id " + providerId));

        if (Boolean.TRUE.equals(provider.getIsDeleted())) {
            throw new BadRequestException("Provider has been deleted");
        }

        if (!Boolean.TRUE.equals(provider.getIsVerified())) {
            throw new BadRequestException("Provider is not verified");
        }

        // Calculate subtotal
        Double subtotal = cartItems.stream()
                .mapToDouble(Cart::getItemTotal)
                .sum();

        // Validate minimum order amount (if needed)
        if (subtotal <= 0) {
            throw new BadRequestException("Order subtotal must be greater than 0");
        }

        // Calculate delivery fee (fixed 50.0 for now)
        Double deliveryFee = req.getDeliveryFee() != null && req.getDeliveryFee() >= 0 ? req.getDeliveryFee() : 50.0;

        // Calculate platform commission (percentage of subtotal)
        Double commissionRate = provider.getCommissionRate() != null ? provider.getCommissionRate() : 0.0;
        Double platformCommission = Math.round((subtotal * commissionRate) / 100.0 * 100.0) / 100.0; // Round to 2 decimal places

        // Calculate total amount (round to 2 decimal places)
        Double totalAmount = Math.round((subtotal + deliveryFee + platformCommission) * 100.0) / 100.0;

        // Determine payment method and type
        String paymentMethodStr = req.getPaymentMethod() != null ? req.getPaymentMethod().toUpperCase() : "CASH";
        PaymentMethod paymentMethod;
        PaymentType paymentType;
        PaymentStatus paymentStatus;
        OrderStatus initialOrderStatus;
        
        try {
            paymentMethod = PaymentMethod.valueOf(paymentMethodStr);
        } catch (IllegalArgumentException e) {
            // Default to CASH if invalid payment method
            paymentMethod = PaymentMethod.CASH;
        }
        
        // If payment method is CASH, it's COD (Cash on Delivery)
        if (paymentMethod == PaymentMethod.CASH) {
            paymentType = PaymentType.COD;
            paymentStatus = PaymentStatus.PENDING; // Will be marked as SUCCESS on delivery
            initialOrderStatus = OrderStatus.CONFIRMED; // COD orders are confirmed immediately
        } else {
            // For online payments (UPI, Card, etc.), it's PREPAID
            paymentType = PaymentType.PREPAID;
            paymentStatus = PaymentStatus.PENDING; // Will be updated after Razorpay payment
            initialOrderStatus = OrderStatus.PENDING; // Wait for payment confirmation
        }

        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setProvider(provider);
        order.setOrderStatus(initialOrderStatus);
        order.setDeliveryFee(deliveryFee);
        order.setPlatformCommission(platformCommission);
        order.setTotalAmount(totalAmount);
        order.setDeliveryAddress(req.getDeliveryAddress());
        order.setIsDeleted(false);

        // Store cart item IDs as JSON
        try {
            List<Long> cartItemIds = cartItems.stream()
                    .map(Cart::getId)
                    .collect(Collectors.toList());
            String cartItemIdsJson = objectMapper.writeValueAsString(cartItemIds);
            order.setCartItemIds(cartItemIdsJson);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Failed to serialize cart item IDs");
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Initialize payout entry for provider (if doesn't exist)
        // This ensures payout record exists immediately after order creation
        // Amount will be added only when payment succeeds (business logic unchanged)
        try {
            payoutService.initializePayoutIfNotExists(providerId);
        } catch (Exception e) {
            // Log but don't fail order creation if payout initialization fails
            System.err.println("WARNING: Failed to initialize payout entry for provider " + providerId + ": " + e.getMessage());
            e.printStackTrace();
        }

        // Create Payment record only for COD orders
        // For Razorpay/prepaid orders, payment will be created in PaymentService.createRazorpayOrder()
        if (paymentType == PaymentType.COD) {
            Payment payment = new Payment();
            payment.setOrder(savedOrder);
            payment.setPaymentType(paymentType);
            payment.setAmount(totalAmount);
            payment.setPaymentStatus(paymentStatus);
            payment.setPaymentMethod(paymentMethod);
            payment.setTransactionId(null); // Will be set on COD delivery
            payment.setPaymentTime(null); // Will be set when payment is completed
            payment.setIsDeleted(false);
            paymentRepository.save(payment);
        }
        // For PREPAID orders, payment will be created when createRazorpayOrder() is called

        // Soft delete cart items after order creation
        cartItems.forEach(cart -> cart.setIsDeleted(true));
        cartRepository.saveAll(cartItems);

        return savedOrder;
    }

    public Order getOrderById(Long orderId, Long customerId) {
        Optional<Order> order = orderRepository.findByIdAndCustomer_IdAndIsDeletedFalse(orderId, customerId);
        return order.orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
    }

    public List<Order> getCustomerOrders(Long customerId) {
        return orderRepository.findAllByCustomer_IdAndIsDeletedFalseOrderByOrderTimeDesc(customerId);
    }

    public Order getProviderOrderById(Long orderId, Long providerId) {
        Optional<Order> order = orderRepository.findByIdAndProvider_IdAndIsDeletedFalse(orderId, providerId);
        return order.orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
    }

    public List<Order> getProviderOrders(Long providerId) {
        return orderRepository.findAllByProvider_IdAndIsDeletedFalseOrderByOrderTimeDesc(providerId);
    }

    public Order getDeliveryPartnerOrderById(Long orderId, Long deliveryPartnerId) {
        Optional<Order> order = orderRepository.findByIdAndDeliveryPartner_IdAndIsDeletedFalse(orderId, deliveryPartnerId);
        return order.orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
    }

    public List<Order> getDeliveryPartnerOrders(Long deliveryPartnerId) {
        return orderRepository.findAllByDeliveryPartner_IdAndIsDeletedFalseOrderByOrderTimeDesc(deliveryPartnerId);
    }
    
    /**
     * Get orders available for delivery partners (READY status, no delivery partner assigned)
     * 
     * @return List of available orders
     */
    public List<Order> getAvailableOrdersForDelivery() {
        // Get orders that are READY and don't have a delivery partner assigned
        List<Order> readyOrders = orderRepository.findAllByOrderStatusAndIsDeletedFalse(OrderStatus.READY);
        // Filter out orders that already have a delivery partner
        return readyOrders.stream()
                .filter(order -> order.getDeliveryPartner() == null)
                .collect(Collectors.toList());
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Long providerId, OrderDtos.UpdateStatusRequest req) {
        Order order = getProviderOrderById(orderId, providerId);

        OrderStatus newStatus = req.getOrderStatus();
        OrderStatus currentStatus = order.getOrderStatus();

        // Validate status transition
        if (newStatus == null) {
            throw new BadRequestException("Order status cannot be null");
        }
        
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order.setOrderStatus(newStatus);

        // Set estimated delivery time if provided
        if (req.getEstimatedDeliveryTime() != null) {
            order.setEstimatedDeliveryTime(req.getEstimatedDeliveryTime());
        }

        // Generate OTP when order status changes to READY
        if (newStatus == OrderStatus.READY && currentStatus != OrderStatus.READY) {
            generateDeliveryOTP(order);
        }

        // Set delivery time when status is DELIVERED
        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveryTime(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateDeliveryStatus(Long orderId, Long deliveryPartnerId, OrderDtos.UpdateStatusRequest req) {
        Order order = getDeliveryPartnerOrderById(orderId, deliveryPartnerId);

        OrderStatus newStatus = req.getOrderStatus();
        OrderStatus currentStatus = order.getOrderStatus();

        // Delivery partner can only update to OUT_FOR_DELIVERY or DELIVERED
        if (newStatus != OrderStatus.OUT_FOR_DELIVERY && newStatus != OrderStatus.DELIVERED) {
            throw new BadRequestException("Delivery partner can only update status to OUT_FOR_DELIVERY or DELIVERED");
        }

        // Validate status transition
        if (currentStatus == OrderStatus.READY && newStatus == OrderStatus.OUT_FOR_DELIVERY) {
            order.setOrderStatus(newStatus);
        } else if (currentStatus == OrderStatus.OUT_FOR_DELIVERY && newStatus == OrderStatus.DELIVERED) {
            // OTP verification should be done separately before calling this
            // This method will be called after OTP is verified in the controller
            order.setOrderStatus(newStatus);
            order.setDeliveryTime(LocalDateTime.now());
            // Clear OTP after successful delivery
            order.setOtp(null);
            order.setOtpGeneratedAt(null);
            order.setOtpExpiresAt(null);
        } else {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order assignDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        return assignDeliveryPartner(orderId, deliveryPartnerId, null);
    }

    @Transactional
    public Order assignDeliveryPartner(Long orderId, Long deliveryPartnerId, Long providerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        if (Boolean.TRUE.equals(order.getIsDeleted())) {
            throw new ResourceNotFoundException("Order not found with id " + orderId);
        }

        // If providerId is provided (provider assigning): Validate order belongs to provider
        if (providerId != null) {
            if (!order.getProvider().getId().equals(providerId)) {
                throw new BadRequestException("Order does not belong to this provider");
            }
        }

        // Validate order is in a status that allows delivery partner assignment
        OrderStatus currentStatus = order.getOrderStatus();
        if (currentStatus != OrderStatus.CONFIRMED && 
            currentStatus != OrderStatus.PREPARING && 
            currentStatus != OrderStatus.READY) {
            throw new BadRequestException("Order must be in CONFIRMED, PREPARING, or READY status to assign delivery partner");
        }
        
        // Generate OTP if order is READY and doesn't have one yet
        if (currentStatus == OrderStatus.READY && (order.getOtp() == null || order.getOtp().isEmpty())) {
            generateDeliveryOTP(order);
        }

        // Validate delivery partner exists and is available
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with id " + deliveryPartnerId));

        if (Boolean.TRUE.equals(deliveryPartner.getIsDeleted())) {
            throw new BadRequestException("Delivery partner has been deleted");
        }

        if (!Boolean.TRUE.equals(deliveryPartner.getIsAvailable())) {
            throw new BadRequestException("Delivery partner is not available");
        }

        // If providerId is provided (provider assigning): Validate delivery partner belongs to provider OR is global
        if (providerId != null) {
            if (deliveryPartner.getProviderId() != null && !deliveryPartner.getProviderId().equals(providerId)) {
                throw new BadRequestException("Provider cannot assign another provider's delivery partner");
            }
            // Global delivery partners (providerId = null) are allowed
        }

        // Optional: Validate delivery partner zone matches provider zone (if zone-based delivery)
        // This can be implemented later based on business requirements

        order.setDeliveryPartner(deliveryPartner);
        // Don't change status here - delivery partner will mark as OUT_FOR_DELIVERY when they pickup
        // Status should only change when delivery partner accepts and picks up the order

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, Long customerId) {
        Order order = getOrderById(orderId, customerId);

        // Only allow cancellation if order is PENDING or CONFIRMED
        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order can only be cancelled if it is PENDING or CONFIRMED");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll().stream()
                .filter(order -> !Boolean.TRUE.equals(order.getIsDeleted()))
                .collect(Collectors.toList());
    }

    private boolean isValidStatusTransition(OrderStatus current, OrderStatus next) {
        // Allow cancellation from any status (handled separately)
        if (next == OrderStatus.CANCELLED) {
            return true;
        }

        // Valid transitions
        switch (current) {
            case PENDING:
                return next == OrderStatus.CONFIRMED || next == OrderStatus.CANCELLED;
            case CONFIRMED:
                return next == OrderStatus.PREPARING || next == OrderStatus.CANCELLED;
            case PREPARING:
                return next == OrderStatus.READY || next == OrderStatus.CANCELLED;
            case READY:
                return next == OrderStatus.OUT_FOR_DELIVERY || next == OrderStatus.CANCELLED;
            case OUT_FOR_DELIVERY:
                return next == OrderStatus.DELIVERED;
            case DELIVERED:
            case CANCELLED:
                return false; // Terminal states
            default:
                return false;
        }
    }

    public List<Cart> getOrderCartItems(Order order) {
        if (order == null || order.getCartItemIds() == null || order.getCartItemIds().trim().isEmpty()) {
            return List.of();
        }
        
        try {
            List<Long> cartItemIds = objectMapper.readValue(order.getCartItemIds(), new TypeReference<List<Long>>() {});
            if (cartItemIds.isEmpty()) {
                return List.of();
            }
            // Note: Cart items are soft deleted after order creation, but we still return them for order history
            // Use findAllById since cart items are soft-deleted after order creation
            // but we still need to access them for order history
            List<Cart> cartItems = cartRepository.findAllById(cartItemIds);
            return cartItems;
        } catch (JsonProcessingException e) {
            // Log error but return empty list to prevent breaking order view
            // In production, you might want to log this error
            return List.of();
        }
    }
    
    /**
     * Generate 6-digit OTP for order delivery verification
     * OTP is valid for 2 hours
     * 
     * @param order Order to generate OTP for
     */
    private void generateDeliveryOTP(Order order) {
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000); // 6-digit OTP (100000-999999)
        String otp = String.valueOf(otpValue);
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusHours(2); // OTP valid for 2 hours
        
        order.setOtp(otp);
        order.setOtpGeneratedAt(now);
        order.setOtpExpiresAt(expiresAt);
    }
    
    /**
     * Verify delivery OTP before marking order as DELIVERED
     * 
     * @param order Order to verify OTP for
     * @param providedOtp OTP provided by delivery partner
     * @return true if OTP is valid, false otherwise
     */
    private boolean verifyDeliveryOTP(Order order, String providedOtp) {
        if (order.getOtp() == null || order.getOtp().isEmpty()) {
            throw new BadRequestException("OTP has not been generated for this order");
        }
        
        if (order.getOtpExpiresAt() == null) {
            throw new BadRequestException("OTP expiration time is not set");
        }
        
        // Check if OTP has expired
        if (LocalDateTime.now().isAfter(order.getOtpExpiresAt())) {
            throw new BadRequestException("OTP has expired. Please regenerate OTP.");
        }
        
        // Verify OTP matches
        return order.getOtp().equals(providedOtp);
    }
    
    /**
     * Generate delivery OTP for an order (called when status changes to READY)
     * 
     * @param orderId Order ID
     * @return Generated OTP
     */
    @Transactional
    public String generateDeliveryOTP(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        
        if (order.getOrderStatus() != OrderStatus.READY) {
            throw new BadRequestException("OTP can only be generated when order status is READY");
        }
        
        generateDeliveryOTP(order);
        orderRepository.save(order);
        
        return order.getOtp();
    }
    
    /**
     * Verify delivery OTP
     * 
     * @param orderId Order ID
     * @param otp OTP to verify
     * @return true if OTP is valid
     */
    public boolean verifyDeliveryOTP(Long orderId, String otp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        
        return verifyDeliveryOTP(order, otp);
    }
    
    /**
     * Delivery partner accepts an available order
     * 
     * @param orderId Order ID
     * @param deliveryPartnerId Delivery Partner ID
     * @return Updated order
     */
    @Transactional
    public Order acceptOrderByDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        
        if (Boolean.TRUE.equals(order.getIsDeleted())) {
            throw new ResourceNotFoundException("Order not found with id " + orderId);
        }
        
        // Validate order is available (READY status, no delivery partner assigned)
        if (order.getOrderStatus() != OrderStatus.READY) {
            throw new BadRequestException("Order must be in READY status to be accepted");
        }
        
        if (order.getDeliveryPartner() != null) {
            throw new BadRequestException("Order is already assigned to another delivery partner");
        }
        
        // Validate delivery partner exists and is available
        DeliveryPartner deliveryPartner = deliveryPartnerRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with id " + deliveryPartnerId));
        
        if (Boolean.TRUE.equals(deliveryPartner.getIsDeleted())) {
            throw new BadRequestException("Delivery partner has been deleted");
        }
        
        if (!Boolean.TRUE.equals(deliveryPartner.getIsAvailable())) {
            throw new BadRequestException("Delivery partner is not available");
        }
        
        // Assign delivery partner (status remains READY until pickup)
        order.setDeliveryPartner(deliveryPartner);
        
        return orderRepository.save(order);
    }
    
    /**
     * Delivery partner picks up the order (marks as OUT_FOR_DELIVERY)
     * 
     * @param orderId Order ID
     * @param deliveryPartnerId Delivery Partner ID
     * @return Updated order
     */
    @Transactional
    public Order pickupOrderByDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        Order order = getDeliveryPartnerOrderById(orderId, deliveryPartnerId);
        
        if (order.getOrderStatus() != OrderStatus.READY) {
            throw new BadRequestException("Order must be in READY status to be picked up");
        }
        
        if (!order.getDeliveryPartner().getId().equals(deliveryPartnerId)) {
            throw new BadRequestException("Order is not assigned to this delivery partner");
        }
        
        // Generate OTP if not already generated
        if (order.getOtp() == null || order.getOtp().isEmpty()) {
            generateDeliveryOTP(order);
        }
        
        order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);
        Order savedOrder = orderRepository.save(order);
        
        // Send OTP email to customer
        sendOTPEmailToCustomer(savedOrder);
        
        return savedOrder;
    }
    
    /**
     * Send OTP email to customer when delivery partner picks up the order
     * 
     * @param order Order with OTP
     */
    private void sendOTPEmailToCustomer(Order order) {
        try {
            // Get customer email from order
            Customer customer = order.getCustomer();
            if (customer == null || customer.getUser() == null) {
                logger.warn("Cannot send OTP email: Customer or User not found for order {}", order.getId());
                return;
            }
            
            String customerEmail = customer.getUser().getEmail();
            if (customerEmail == null || customerEmail.trim().isEmpty()) {
                logger.warn("Cannot send OTP email: Customer email is empty for order {}", order.getId());
                return;
            }
            
            String otp = order.getOtp();
            if (otp == null || otp.isEmpty()) {
                logger.warn("Cannot send OTP email: OTP is not generated for order {}", order.getId());
                return;
            }
            
            // Create email content
            String subject = "Your Order Delivery OTP - PlateMate";
            String body = String.format(
                "<h2>Order Delivery OTP</h2>" +
                "<p>Hello %s,</p>" +
                "<p>Your order #%d has been picked up by the delivery partner and is on its way!</p>" +
                "<p><strong>Your OTP for delivery verification is: <span style='font-size: 24px; color: #FF775C; font-weight: bold;'>%s</span></strong></p>" +
                "<p>Please share this OTP with the delivery partner when they arrive at your location.</p>" +
                "<p><strong>Note:</strong> This OTP is valid for 2 hours and expires at %s.</p>" +
                "<p>Thank you for choosing PlateMate!</p>",
                customer.getFullName() != null ? customer.getFullName() : "Customer",
                order.getId(),
                otp,
                order.getOtpExpiresAt() != null ? order.getOtpExpiresAt().toString() : "N/A"
            );
            
            // Send email
            boolean emailSent = emailService.sendEmail(customerEmail, subject, body);
            if (emailSent) {
                logger.info("OTP email sent successfully to customer {} for order {}", customerEmail, order.getId());
            } else {
                logger.error("Failed to send OTP email to customer {} for order {}", customerEmail, order.getId());
            }
        } catch (Exception e) {
            logger.error("Error sending OTP email to customer for order {}: {}", order.getId(), e.getMessage(), e);
            // Don't throw exception - email failure shouldn't block order pickup
        }
    }
    
    /**
     * Delivery partner delivers the order with OTP verification
     * 
     * @param orderId Order ID
     * @param deliveryPartnerId Delivery Partner ID
     * @param otp OTP for verification
     * @return Updated order
     */
    @Transactional
    public Order deliverOrderByDeliveryPartner(Long orderId, Long deliveryPartnerId, String otp) {
        Order order = getDeliveryPartnerOrderById(orderId, deliveryPartnerId);
        
        if (order.getOrderStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order must be in OUT_FOR_DELIVERY status to be delivered");
        }
        
        if (!order.getDeliveryPartner().getId().equals(deliveryPartnerId)) {
            throw new BadRequestException("Order is not assigned to this delivery partner");
        }
        
        // Verify OTP
        if (!verifyDeliveryOTP(order, otp)) {
            throw new BadRequestException("Invalid OTP. Please check and try again.");
        }
        
        // Mark as delivered
        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setDeliveryTime(LocalDateTime.now());
        
        // Clear OTP after successful delivery
        order.setOtp(null);
        order.setOtpGeneratedAt(null);
        order.setOtpExpiresAt(null);
        
        // If payment is COD, mark payment as successful
        Payment payment = paymentRepository.findByOrder_IdAndIsDeletedFalse(orderId).orElse(null);
        if (payment != null && payment.getPaymentType() == PaymentType.COD) {
            // ✅ FIX: Prevent duplicate processing - check if already SUCCESS
            if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
                System.out.println("DEBUG: COD payment already marked as SUCCESS for order " + orderId + 
                    ", skipping payout update to prevent duplicates");
            } else {
                payment.setPaymentStatus(PaymentStatus.SUCCESS);
                payment.setPaymentTime(LocalDateTime.now());
                paymentRepository.save(payment);

                // Reload order with provider eagerly loaded to avoid LazyInitializationException
                Order orderWithProvider = orderRepository.findByIdWithProvider(orderId)
                        .orElse(order); // Fallback to original order if query fails
                
                // Add to pending payout amount (wrap in try-catch to prevent order failure if payout update fails)
                if (orderWithProvider.getProvider() != null) {
                    try {
                        Double orderAmount = orderWithProvider.getTotalAmount();
                        Double commission = orderWithProvider.getPlatformCommission() != null ? orderWithProvider.getPlatformCommission() : 0.0;
                        Long providerId = orderWithProvider.getProvider().getId();
                        System.out.println("DEBUG: Adding to pending payout (COD) - Order ID: " + orderId + 
                            ", Provider ID: " + providerId + ", Amount: " + orderAmount + ", Commission: " + commission);
                        payoutService.addToPendingAmount(providerId, orderAmount, commission);
                        System.out.println("DEBUG: Successfully added to pending payout for provider: " + providerId);
                    } catch (Exception e) {
                        // Log error but don't fail order delivery
                        System.err.println("ERROR: Failed to update pending payout amount for order " + orderId + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.err.println("WARNING: Order " + orderId + " has no provider associated");
                }
            }
        }
        
        return orderRepository.save(order);
    }
}

