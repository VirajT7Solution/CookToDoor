package com.cooktodor.controller;

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

import com.cooktodor.dto.CartDtos;
import com.cooktodor.exception.ResourceNotFoundException;
import com.cooktodor.model.Customer;
import com.cooktodor.model.User;
import com.cooktodor.repository.CustomerRepository;
import com.cooktodor.repository.UserRepository;
import com.cooktodor.service.CartService;

@RestController
@RequestMapping("/api/customers/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Customer getCurrentCustomer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return customerRepository.findByUser_IdAndIsDeletedFalse(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user"));
    }

    @PostMapping
    public ResponseEntity<CartDtos.Response> addToCart(@RequestBody CartDtos.CreateRequest req) {
        Customer customer = getCurrentCustomer();
        com.cooktodor.model.Cart cart = cartService.addToCart(customer.getId(), req);
        return ResponseEntity.ok(toResponse(cart));
    }

    @GetMapping
    public ResponseEntity<CartDtos.CartSummaryResponse> getCart() {
        Customer customer = getCurrentCustomer();
        CartDtos.CartSummaryResponse cart = cartService.getCart(customer.getId());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartDtos.Response> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody CartDtos.UpdateRequest req) {
        Customer customer = getCurrentCustomer();
        com.cooktodor.model.Cart cart = cartService.updateCartItem(cartItemId, customer.getId(), req);
        return ResponseEntity.ok(toResponse(cart));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long cartItemId) {
        Customer customer = getCurrentCustomer();
        cartService.removeCartItem(cartItemId, customer.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        Customer customer = getCurrentCustomer();
        cartService.clearCart(customer.getId());
        return ResponseEntity.noContent().build();
    }

    private CartDtos.Response toResponse(com.cooktodor.model.Cart cart) {
        CartDtos.Response response = new CartDtos.Response();
        response.setId(cart.getId());
        response.setMenuItemId(cart.getMenuItem().getId());
        response.setItemName(cart.getMenuItem().getItemName());
        response.setQuantity(cart.getQuantity());
        response.setItemPrice(cart.getItemPrice());
        response.setItemTotal(cart.getItemTotal());
        response.setSpecialInstructions(cart.getSpecialInstructions());
        response.setProviderId(cart.getMenuItem().getProvider().getId());
        response.setProviderName(cart.getMenuItem().getProvider().getBusinessName());
        return response;
    }
}

