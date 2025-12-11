package com.platemate.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.platemate.config.RazorpayProperties;
import com.platemate.enums.OrderStatus;
import com.platemate.enums.PaymentMethod;
import com.platemate.enums.PaymentStatus;
import com.platemate.enums.PaymentType;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Order;
import com.platemate.model.Payment;
import com.platemate.repository.OrderRepository;
import com.platemate.repository.PaymentRepository;
import com.platemate.service.PayoutService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate razorpayRestTemplate;

    @Autowired
    private RazorpayProperties props;

    @Autowired
    private PayoutService payoutService;

    private static final String RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

    public Map<String, Object> createRazorpayOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        if (Boolean.TRUE.equals(order.getIsDeleted())) {
            throw new BadRequestException("Order is deleted");
        }

        double amount = order.getTotalAmount() != null ? order.getTotalAmount() : 0.0;
        if (amount <= 0.0) {
            throw new BadRequestException("Invalid order amount");
        }

        // Check if payment already exists for this order (should not happen for PREPAID, but handle gracefully)
        Optional<Payment> existingPaymentOpt = paymentRepository.findByOrder_IdAndIsDeletedFalse(orderId);
        Payment payment;
        
        if (existingPaymentOpt.isPresent()) {
            // Payment already exists, update it instead of creating new one
            payment = existingPaymentOpt.get();
            payment.setPaymentStatus(PaymentStatus.PENDING);
            payment.setPaymentType(PaymentType.PREPAID);
            payment.setAmount(amount);
            // Don't update transaction ID yet, will be set after Razorpay order creation
        } else {
            // Create a new pending Payment record
            payment = new Payment();
            payment.setOrder(order);
            payment.setPaymentType(PaymentType.PREPAID);
            payment.setAmount(amount);
            payment.setPaymentStatus(PaymentStatus.PENDING);
            payment.setPaymentMethod(PaymentMethod.UPI); // actual method finalized after success
            payment.setTransactionId(null); // Will be set after Razorpay order creation
            payment.setPaymentTime(null); // Will be set when payment is completed
            payment.setIsDeleted(false);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("amount", (long) Math.round(amount * 100)); // paise
        payload.put("currency", props.getRazorpay().getCurrency());
        payload.put("receipt", "order_" + order.getId());
        payload.put("payment_capture", 1);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> rpOrder = razorpayRestTemplate.postForObject(
                RAZORPAY_API_BASE + "/orders", req, Map.class);

        if (rpOrder == null || rpOrder.get("id") == null) {
            throw new BadRequestException("Failed to create Razorpay order");
        }

        // Update payment with Razorpay order ID and save
        payment.setTransactionId(String.valueOf(rpOrder.get("id")));
        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", rpOrder.get("id"));
        response.put("amount", rpOrder.get("amount"));
        response.put("currency", rpOrder.get("currency"));
        return response;
    }

    public Payment markSuccess(String razorpayPaymentId, String razorpayOrderId) {
        Payment payment = paymentRepository.findByTransactionId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order " + razorpayOrderId));
        
        // ✅ FIX: Prevent duplicate processing - check if already SUCCESS
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            System.out.println("DEBUG: Payment already marked as SUCCESS for order " + razorpayOrderId + 
                ", skipping payout update to prevent duplicates");
            return payment; // Already processed, return early
        }
        
        // Fetch payment details from Razorpay to get actual payment method
        try {
            Map<String, Object> paymentDetails = fetchPaymentDetailsFromRazorpay(razorpayPaymentId);
            
            // Extract payment method from Razorpay response
            if (paymentDetails != null && paymentDetails.containsKey("method")) {
                String razorpayMethod = String.valueOf(paymentDetails.get("method"));
                PaymentMethod actualMethod = mapRazorpayMethodToPaymentMethod(razorpayMethod);
                payment.setPaymentMethod(actualMethod);
            }
        } catch (Exception e) {
            // If we can't fetch payment details, log but continue with default
            System.err.println("Warning: Could not fetch payment method from Razorpay: " + e.getMessage());
        }
        
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(razorpayPaymentId);
        payment.setPaymentTime(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        // Reload order with provider eagerly loaded to avoid LazyInitializationException
        Order order = orderRepository.findByIdWithProvider(saved.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        // Update order status to CONFIRMED if currently PENDING
        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        // Add to pending payout amount (wrap in try-catch to prevent payment failure if payout update fails)
        if (order.getProvider() != null) {
            try {
                Double orderAmount = order.getTotalAmount();
                Double commission = order.getPlatformCommission() != null ? order.getPlatformCommission() : 0.0;
                Long providerId = order.getProvider().getId();
                System.out.println("DEBUG: Adding to pending payout - Order ID: " + order.getId() + 
                    ", Provider ID: " + providerId + ", Amount: " + orderAmount + ", Commission: " + commission);
                payoutService.addToPendingAmount(providerId, orderAmount, commission);
                System.out.println("DEBUG: Successfully added to pending payout for provider: " + providerId);
            } catch (Exception e) {
                // Log error but don't fail payment
                System.err.println("ERROR: Failed to update pending payout amount for order " + order.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.err.println("WARNING: Order " + order.getId() + " has no provider associated");
        }

        return saved;
    }

    public Payment markFailed(String razorpayOrderId) {
        Payment payment = paymentRepository.findByTransactionId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order " + razorpayOrderId));
        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setPaymentTime(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
    
    /**
     * Fetch payment details from Razorpay API
     * RestTemplate already has authentication configured via interceptor in RazorpayConfig
     * 
     * @param razorpayPaymentId Payment ID from Razorpay
     * @return Payment details map from Razorpay
     */
    private Map<String, Object> fetchPaymentDetailsFromRazorpay(String razorpayPaymentId) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> paymentDetails = razorpayRestTemplate.getForObject(
                RAZORPAY_API_BASE + "/payments/" + razorpayPaymentId, 
                Map.class
            );
            return paymentDetails;
        } catch (Exception e) {
            throw new BadRequestException("Failed to fetch payment details from Razorpay: " + e.getMessage());
        }
    }
    
    /**
     * Map Razorpay payment method to our PaymentMethod enum
     * 
     * @param razorpayMethod Method from Razorpay (e.g., "upi", "card", "wallet", "netbanking")
     * @return PaymentMethod enum value
     */
    private PaymentMethod mapRazorpayMethodToPaymentMethod(String razorpayMethod) {
        if (razorpayMethod == null) {
            return PaymentMethod.UPI; // Default fallback
        }
        
        String method = razorpayMethod.toLowerCase();
        switch (method) {
            case "upi":
                return PaymentMethod.UPI;
            case "card":
            case "credit_card":
            case "debit_card":
                // Razorpay returns "card" for both, we can't distinguish, default to CREDIT_CARD
                return PaymentMethod.CREDIT_CARD;
            case "netbanking":
            case "net_banking":
                return PaymentMethod.NET_BANKING;
            case "wallet":
                return PaymentMethod.WALLET;
            default:
                return PaymentMethod.UPI; // Default fallback
        }
    }
    
    /**
     * Verify payment from Android app after Razorpay payment success
     * This method verifies the payment and updates order status
     */
    public Order verifyPayment(Long orderId, String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        // Load order with provider eagerly to avoid LazyInitializationException
        Order order = orderRepository.findByIdWithProvider(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));
        
        // Find payment record by order
        Payment payment = paymentRepository.findByOrder_IdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order " + orderId));
        
        // ✅ FIX: Prevent duplicate processing - check if already SUCCESS
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            System.out.println("DEBUG: Payment already marked as SUCCESS for order " + orderId + 
                ", skipping payout update to prevent duplicates");
            return order; // Already processed, return early
        }
        
        // Verify signature if provided (optional for app verification, webhook will also verify)
        // Note: Android SDK doesn't provide signature directly, so this is mainly for webhook verification
        // For app verification, we trust the payment ID from Razorpay and let webhook handle full verification
        if (razorpaySignature != null && !razorpaySignature.isEmpty() && 
            props.getRazorpay().getWebhookSecret() != null && 
            !props.getRazorpay().getWebhookSecret().isEmpty()) {
            // Build payload for signature verification
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String secret = props.getRazorpay().getWebhookSecret();
            if (!verifySignature(payload, razorpaySignature, secret)) {
                throw new BadRequestException("Invalid payment signature");
            }
        }
        // If signature is not provided or webhook secret is not set, we still proceed
        // The webhook will handle full verification when it arrives
        
        // Fetch payment details from Razorpay to get actual payment method
        try {
            Map<String, Object> paymentDetails = fetchPaymentDetailsFromRazorpay(razorpayPaymentId);
            
            // Extract payment method from Razorpay response
            if (paymentDetails != null && paymentDetails.containsKey("method")) {
                String razorpayMethod = String.valueOf(paymentDetails.get("method"));
                PaymentMethod actualMethod = mapRazorpayMethodToPaymentMethod(razorpayMethod);
                payment.setPaymentMethod(actualMethod);
            }
        } catch (Exception e) {
            // If we can't fetch payment details, log but continue with default
            // Payment method will remain as set initially (UPI default)
            System.err.println("Warning: Could not fetch payment method from Razorpay: " + e.getMessage());
        }
        
        // Update payment record
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(razorpayPaymentId);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepository.save(payment);
        
        // Update order status to CONFIRMED if currently PENDING
        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        // Add to pending payout amount (wrap in try-catch to prevent payment failure if payout update fails)
        if (order.getProvider() != null) {
            try {
                Double orderAmount = order.getTotalAmount();
                Double commission = order.getPlatformCommission() != null ? order.getPlatformCommission() : 0.0;
                Long providerId = order.getProvider().getId();
                System.out.println("DEBUG: Adding to pending payout - Order ID: " + order.getId() + 
                    ", Provider ID: " + providerId + ", Amount: " + orderAmount + ", Commission: " + commission);
                payoutService.addToPendingAmount(providerId, orderAmount, commission);
                System.out.println("DEBUG: Successfully added to pending payout for provider: " + providerId);
            } catch (Exception e) {
                // Log error but don't fail payment
                System.err.println("ERROR: Failed to update pending payout amount for order " + order.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.err.println("WARNING: Order " + order.getId() + " has no provider associated");
        }
        
        return order;
    }

    public void verifyAndProcessWebhook(String payload, String signature) {
        String secret = props.getRazorpay().getWebhookSecret();
        if (!verifySignature(payload, signature, secret)) {
            throw new BadRequestException("Invalid webhook signature");
        }

        // Minimal parsing to detect payment status; in production, use a typed model
        // and handle multiple event types like payment.captured, payment.failed
        String paymentId = extractJsonValue(payload, "payment_id");
        String orderId = extractJsonValue(payload, "order_id");
        String event = extractJsonValue(payload, "event");

        if (event != null && event.contains("payment.captured")) {
            if (paymentId != null && orderId != null) {
                markSuccess(paymentId, orderId);
            }
        } else if (event != null && event.contains("payment.failed")) {
            if (orderId != null) {
                markFailed(orderId);
            }
        }
    }

    private boolean verifySignature(String payload, String expectedSignature, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String actual = toHex(hash);
            return actual.equals(expectedSignature);
        } catch (Exception e) {
            return false;
        }
    }

    private String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private String extractJsonValue(String json, String key) {
        // very basic extractor; replace with proper JSON parsing if needed
        String needle = "\"" + key + "\":";
        int idx = json.indexOf(needle);
        if (idx < 0) return null;
        int start = json.indexOf('"', idx + needle.length());
        if (start < 0) return null;
        int end = json.indexOf('"', start + 1);
        if (end < 0) return null;
        return json.substring(start + 1, end);
    }
}


