package com.platemate.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platemate.dto.OrderDtos;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Cart;
import com.platemate.model.Customer;
import com.platemate.model.DeliveryPartner;
import com.platemate.model.Order;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.DeliveryPartnerRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;
import com.platemate.service.OrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    // ==================== Customer Endpoints ====================

    @PostMapping("/customers/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDtos.Response> createOrder(@RequestBody OrderDtos.CreateRequest req) {
        Customer customer = getCurrentCustomer();
        Order order = orderService.createOrder(customer.getId(), req);
        return ResponseEntity.ok(toResponse(order));
    }

    @GetMapping("/customers/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderDtos.Response>> getCustomerOrders() {
        Customer customer = getCurrentCustomer();
        List<Order> orders = orderService.getCustomerOrders(customer.getId());
        List<OrderDtos.Response> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/customers/orders/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDtos.Response> getCustomerOrder(@PathVariable Long id) {
        Customer customer = getCurrentCustomer();
        Order order = orderService.getOrderById(id, customer.getId());
        return ResponseEntity.ok(toResponse(order));
    }

    @PostMapping("/customers/orders/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDtos.Response> cancelOrder(@PathVariable Long id) {
        Customer customer = getCurrentCustomer();
        Order order = orderService.cancelOrder(id, customer.getId());
        return ResponseEntity.ok(toResponse(order));
    }

    // ==================== Provider Endpoints ====================

    @GetMapping("/providers/orders")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<OrderDtos.Response>> getProviderOrders() {
        TiffinProvider provider = getCurrentProvider();
        List<Order> orders = orderService.getProviderOrders(provider.getId());
        List<OrderDtos.Response> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/providers/orders/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<OrderDtos.Response> getProviderOrder(@PathVariable Long id) {
        TiffinProvider provider = getCurrentProvider();
        Order order = orderService.getProviderOrderById(id, provider.getId());
        return ResponseEntity.ok(toResponse(order));
    }

    @PutMapping("/providers/orders/{id}/status")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<OrderDtos.Response> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderDtos.UpdateStatusRequest req) {
        TiffinProvider provider = getCurrentProvider();
        Order order = orderService.updateOrderStatus(id, provider.getId(), req);
        return ResponseEntity.ok(toResponse(order));
    }

    @PostMapping("/providers/orders/{id}/cancel")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<OrderDtos.Response> cancelOrderByProvider(@PathVariable Long id) {
        TiffinProvider provider = getCurrentProvider();
        Order order = orderService.getProviderOrderById(id, provider.getId());
        
        // Provider can cancel order if it's PENDING or CONFIRMED
        if (order.getOrderStatus() != com.platemate.enums.OrderStatus.PENDING && 
            order.getOrderStatus() != com.platemate.enums.OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order can only be cancelled if it is PENDING or CONFIRMED");
        }
        
        com.platemate.dto.OrderDtos.UpdateStatusRequest cancelRequest = new com.platemate.dto.OrderDtos.UpdateStatusRequest();
        cancelRequest.setOrderStatus(com.platemate.enums.OrderStatus.CANCELLED);
        Order cancelledOrder = orderService.updateOrderStatus(id, provider.getId(), cancelRequest);
        return ResponseEntity.ok(toResponse(cancelledOrder));
    }

    // ==================== Delivery Partner Endpoints ====================

    @GetMapping("/delivery-partners/orders")
    public ResponseEntity<List<OrderDtos.Response>> getDeliveryPartnerOrders() {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        List<Order> orders = orderService.getDeliveryPartnerOrders(deliveryPartner.getId());
        List<OrderDtos.Response> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/delivery-partners/orders/{id}")
    // @PreAuthorize("hasRole('ROLE_DELIVERY')")
    public ResponseEntity<OrderDtos.Response> getDeliveryPartnerOrder(@PathVariable Long id) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        Order order = orderService.getDeliveryPartnerOrderById(id, deliveryPartner.getId());
        return ResponseEntity.ok(toResponse(order));
    }

    @PutMapping("/delivery-partners/orders/{id}/status")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<OrderDtos.Response> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody OrderDtos.UpdateStatusRequest req) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        Order order = orderService.updateDeliveryStatus(id, deliveryPartner.getId(), req);
        return ResponseEntity.ok(toResponse(order));
    }
    
    @GetMapping("/delivery-partners/available-orders")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<List<OrderDtos.Response>> getAvailableOrders() {
        List<Order> orders = orderService.getAvailableOrdersForDelivery();
        List<OrderDtos.Response> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping("/delivery-partners/orders/{id}/accept")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<OrderDtos.Response> acceptOrder(@PathVariable Long id) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        Order order = orderService.acceptOrderByDeliveryPartner(id, deliveryPartner.getId());
        return ResponseEntity.ok(toResponse(order));
    }
    
    @PostMapping("/delivery-partners/orders/{id}/pickup")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<OrderDtos.Response> pickupOrder(@PathVariable Long id) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        Order order = orderService.pickupOrderByDeliveryPartner(id, deliveryPartner.getId());
        return ResponseEntity.ok(toResponse(order));
    }
    
    @PostMapping("/delivery-partners/orders/{id}/deliver")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<OrderDtos.Response> deliverOrder(
            @PathVariable Long id,
            @RequestBody OrderDtos.DeliveryOTPRequest otpRequest) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        
        if (otpRequest.getOtp() == null || otpRequest.getOtp().trim().isEmpty()) {
            throw new BadRequestException("OTP is required for delivery confirmation");
        }
        
        Order order = orderService.deliverOrderByDeliveryPartner(id, deliveryPartner.getId(), otpRequest.getOtp());
        return ResponseEntity.ok(toResponse(order));
    }
    
    @PostMapping("/delivery-partners/orders/{id}/verify-otp")
    // @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<Map<String, Object>> verifyOTP(
            @PathVariable Long id,
            @RequestBody OrderDtos.DeliveryOTPRequest otpRequest) {
        DeliveryPartner deliveryPartner = getCurrentDeliveryPartner();
        Order order = orderService.getDeliveryPartnerOrderById(id, deliveryPartner.getId());
        
        boolean isValid = orderService.verifyDeliveryOTP(id, otpRequest.getOtp());
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        if (isValid) {
            response.put("message", "OTP verified successfully");
        } else {
            response.put("message", "Invalid OTP");
        }
        
        return ResponseEntity.ok(response);
    }

    // ==================== Admin Endpoints ====================

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDtos.Response>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderDtos.Response> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/admin/orders/{orderId}/assign-delivery/{deliveryPartnerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDtos.Response> assignDeliveryPartner(
            @PathVariable Long orderId,
            @PathVariable Long deliveryPartnerId) {
        Order order = orderService.assignDeliveryPartner(orderId, deliveryPartnerId);
        return ResponseEntity.ok(toResponse(order));
    }

    @PostMapping("/providers/orders/{orderId}/assign-delivery/{deliveryPartnerId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<OrderDtos.Response> assignDeliveryPartnerByProvider(
            @PathVariable Long orderId,
            @PathVariable Long deliveryPartnerId) {
        TiffinProvider provider = getCurrentProvider();
        Order order = orderService.assignDeliveryPartner(orderId, deliveryPartnerId, provider.getId());
        return ResponseEntity.ok(toResponse(order));
    }

    // ==================== Helper Methods ====================

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private Customer getCurrentCustomer() {
        User user = getCurrentUser();
        return customerRepository.findByUser_IdAndIsDeletedFalse(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user"));
    }

    private TiffinProvider getCurrentProvider() {
        User user = getCurrentUser();
        TiffinProvider provider = tiffinProviderRepository.findByUser_Id(user.getId());
        if (provider == null) {
            throw new ResourceNotFoundException("Provider profile not found for user");
        }
        return provider;
    }

    private DeliveryPartner getCurrentDeliveryPartner() {
        User user = getCurrentUser();
        List<DeliveryPartner> partners = deliveryPartnerRepository.findByUser_IdAndIsDeletedFalse(user.getId());
        if (partners.isEmpty()) {
            throw new ResourceNotFoundException("Delivery partner profile not found for user");
        }
        // Return the first delivery partner (or you can add logic to select specific one)
        return partners.get(0);
    }

    private OrderDtos.Response toResponse(Order order) {
        OrderDtos.Response response = new OrderDtos.Response();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setProviderId(order.getProvider().getId());
        response.setProviderName(order.getProvider().getBusinessName());
        
        if (order.getDeliveryPartner() != null) {
            response.setDeliveryPartnerId(order.getDeliveryPartner().getId());
            response.setDeliveryPartnerName(order.getDeliveryPartner().getFullName());
        }
        
        response.setOrderStatus(order.getOrderStatus());
        response.setDeliveryFee(order.getDeliveryFee());
        response.setPlatformCommission(order.getPlatformCommission());
        response.setTotalAmount(order.getTotalAmount());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setOrderTime(order.getOrderTime());
        response.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        response.setDeliveryTime(order.getDeliveryTime());
        
        // Add OTP information (only if OTP exists and not expired)
        if (order.getOtp() != null && !order.getOtp().isEmpty()) {
            response.setHasOTP(true);
            response.setOtpExpiresAt(order.getOtpExpiresAt());
        } else {
            response.setHasOTP(false);
            response.setOtpExpiresAt(null);
        }

        // Get cart items (may be empty if items were deleted, but order history should still show)
        List<Cart> cartItems = orderService.getOrderCartItems(order);
        List<OrderDtos.OrderItemResponse> orderItems = cartItems.stream()
                .filter(cart -> cart.getMenuItem() != null) // Filter out items with null menuItem
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList());
        response.setCartItems(orderItems);

        // Calculate subtotal from cart items (use stored order total if items missing)
        if (!cartItems.isEmpty()) {
            Double subtotal = cartItems.stream()
                    .mapToDouble(Cart::getItemTotal)
                    .sum();
            response.setSubtotal(subtotal);
        } else {
            // If cart items are missing, calculate subtotal from order totals
            // subtotal = totalAmount - deliveryFee - platformCommission
            Double calculatedSubtotal = order.getTotalAmount() - order.getDeliveryFee() - order.getPlatformCommission();
            response.setSubtotal(Math.round(calculatedSubtotal * 100.0) / 100.0);
        }

        return response;
    }

    private OrderDtos.OrderItemResponse toOrderItemResponse(Cart cart) {
        OrderDtos.OrderItemResponse response = new OrderDtos.OrderItemResponse();
        response.setCartItemId(cart.getId());
        
        // Safe access - menu item may be null if deleted
        if (cart.getMenuItem() != null) {
            response.setItemName(cart.getMenuItem().getItemName());
        } else {
            response.setItemName("Item no longer available");
        }
        
        response.setQuantity(cart.getQuantity());
        response.setItemPrice(cart.getItemPrice());
        response.setItemTotal(cart.getItemTotal());
        return response;
    }
}

