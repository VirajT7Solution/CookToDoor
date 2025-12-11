package com.platemate.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.dto.CartDtos;
import com.platemate.exception.BadRequestException;
import com.platemate.exception.ForbiddenException;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Cart;
import com.platemate.model.Customer;
import com.platemate.model.MenuItem;
import com.platemate.repository.CartRepository;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.MenuItemRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Transactional
    public Cart addToCart(Long customerId, CartDtos.CreateRequest req) {
        // Validate customer exists
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        // Validate menu item exists and is available
        MenuItem menuItem = menuItemRepository.findById(req.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id " + req.getMenuItemId()));

        if (Boolean.TRUE.equals(menuItem.getIsDeleted())) {
            throw new ResourceNotFoundException("Menu item not found with id " + req.getMenuItemId());
        }

        if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
            throw new BadRequestException("Menu item is not available");
        }

        // Validate quantity
        if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        // Check if item already in cart
        Optional<Cart> existingCartItem = cartRepository.findByCustomer_IdAndMenuItem_IdAndIsDeletedFalse(
                customerId, req.getMenuItemId());

        // Validate max quantity (if set)
        int requestedQuantity = req.getQuantity();
        Integer maxQuantity = menuItem.getMaxQuantity();
        if (maxQuantity != null && maxQuantity > 0) {
            if (existingCartItem.isPresent()) {
                // Check total quantity after adding
                int currentQuantity = existingCartItem.get().getQuantity();
                int totalQuantity = currentQuantity + requestedQuantity;
                if (totalQuantity > maxQuantity) {
                    throw new BadRequestException(
                        String.format("Maximum quantity allowed is %d. Current cart quantity: %d, requested: %d",
                            maxQuantity, currentQuantity, requestedQuantity));
                }
            } else {
                // New item, check requested quantity
                if (requestedQuantity > maxQuantity) {
                    throw new BadRequestException(
                        String.format("Maximum quantity allowed is %d",
                            maxQuantity));
                }
            }
        }

        if (existingCartItem.isPresent()) {
            // Update quantity
            Cart cart = existingCartItem.get();
            cart.setQuantity(cart.getQuantity() + req.getQuantity());
            cart.setItemPrice(menuItem.getPrice()); // Update price snapshot
            cart.setItemTotal(cart.getItemPrice() * cart.getQuantity());
            if (req.getSpecialInstructions() != null) {
                cart.setSpecialInstructions(req.getSpecialInstructions());
            }
            return cartRepository.save(cart);
        } else {
            // Create new cart item
            Cart cart = new Cart();
            cart.setCustomer(customer);
            cart.setMenuItem(menuItem);
            cart.setQuantity(req.getQuantity());
            cart.setItemPrice(menuItem.getPrice()); // Snapshot price at time of addition
            cart.setItemTotal(menuItem.getPrice() * req.getQuantity());
            cart.setSpecialInstructions(req.getSpecialInstructions());
            cart.setIsDeleted(false);
            return cartRepository.save(cart);
        }
    }

    public CartDtos.CartSummaryResponse getCart(Long customerId) {
        // Validate customer exists
        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        List<Cart> cartItems = cartRepository.findAllByCustomer_IdAndIsDeletedFalse(customerId);

        List<CartDtos.Response> items = cartItems.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        Double subtotal = cartItems.stream()
                .mapToDouble(Cart::getItemTotal)
                .sum();

        Integer totalItems = cartItems.stream()
                .mapToInt(Cart::getQuantity)
                .sum();

        // Group by provider
        java.util.Map<Long, List<CartDtos.Response>> groupedByProvider = items.stream()
                .collect(Collectors.groupingBy(CartDtos.Response::getProviderId));

        CartDtos.CartSummaryResponse response = new CartDtos.CartSummaryResponse();
        response.setItems(items);
        response.setSubtotal(subtotal);
        response.setTotalItems(totalItems);
        response.setGroupedByProvider(groupedByProvider);

        return response;
    }

    @Transactional
    public Cart updateCartItem(Long cartItemId, Long customerId, CartDtos.UpdateRequest req) {
        Cart cart = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + cartItemId));

        // Validate ownership
        if (!cart.getCustomer().getId().equals(customerId)) {
            throw new ForbiddenException("Cart item does not belong to customer");
        }

        if (Boolean.TRUE.equals(cart.getIsDeleted())) {
            throw new ResourceNotFoundException("Cart item not found with id " + cartItemId);
        }

        // Validate menu item still available
        MenuItem menuItem = cart.getMenuItem();
        if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
            throw new BadRequestException("Menu item is no longer available");
        }

        // Update quantity if provided
        if (req.getQuantity() != null) {
            if (req.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be greater than 0");
            }
            // Validate max quantity (if set)
            Integer maxQuantity = menuItem.getMaxQuantity();
            if (maxQuantity != null && maxQuantity > 0 && req.getQuantity() > maxQuantity) {
                throw new BadRequestException(
                    String.format("Maximum quantity allowed is %d",
                        maxQuantity));
            }
            cart.setQuantity(req.getQuantity());
            // Preserve original price snapshot - don't update price when updating quantity
            cart.setItemTotal(cart.getItemPrice() * cart.getQuantity());
        }

        // Update special instructions if provided
        if (req.getSpecialInstructions() != null) {
            cart.setSpecialInstructions(req.getSpecialInstructions());
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public void removeCartItem(Long cartItemId, Long customerId) {
        Cart cart = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + cartItemId));

        // Validate ownership
        if (!cart.getCustomer().getId().equals(customerId)) {
            throw new ForbiddenException("Cart item does not belong to customer");
        }

        cart.setIsDeleted(true);
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long customerId) {
        // Validate customer exists
        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        List<Cart> cartItems = cartRepository.findAllByCustomer_IdAndIsDeletedFalse(customerId);
        cartItems.forEach(cart -> cart.setIsDeleted(true));
        cartRepository.saveAll(cartItems);
    }

    public List<Cart> validateCartItems(Long customerId, List<Long> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new BadRequestException("Cart item IDs cannot be empty");
        }

        // Check for duplicate cart item IDs
        long distinctCount = cartItemIds.stream().distinct().count();
        if (distinctCount != cartItemIds.size()) {
            throw new BadRequestException("Duplicate cart item IDs are not allowed");
        }

        List<Cart> cartItems = cartRepository.findAllByIdInAndIsDeletedFalse(cartItemIds);

        if (cartItems.size() != cartItemIds.size()) {
            throw new ResourceNotFoundException("One or more cart items not found");
        }

        // Validate all items belong to customer
        for (Cart cart : cartItems) {
            if (!cart.getCustomer().getId().equals(customerId)) {
                throw new ForbiddenException("Cart item does not belong to customer");
            }

            // Validate items are still available
            if (!Boolean.TRUE.equals(cart.getMenuItem().getIsAvailable())) {
                throw new BadRequestException("Menu item " + cart.getMenuItem().getItemName() + " is not available");
            }

            if (Boolean.TRUE.equals(cart.getMenuItem().getIsDeleted())) {
                throw new BadRequestException("Menu item " + cart.getMenuItem().getItemName() + " has been deleted");
            }
        }

        return cartItems;
    }

    private CartDtos.Response toResponse(Cart cart) {
        CartDtos.Response response = new CartDtos.Response();
        response.setId(cart.getId());
        
        // Safe access to menu item (may be lazy loaded)
        if (cart.getMenuItem() != null) {
            response.setMenuItemId(cart.getMenuItem().getId());
            response.setItemName(cart.getMenuItem().getItemName());
            
            // Safe access to provider (may be lazy loaded)
            if (cart.getMenuItem().getProvider() != null) {
                response.setProviderId(cart.getMenuItem().getProvider().getId());
                response.setProviderName(cart.getMenuItem().getProvider().getBusinessName());
            }
        }
        
        response.setQuantity(cart.getQuantity());
        response.setItemPrice(cart.getItemPrice());
        response.setItemTotal(cart.getItemTotal());
        response.setSpecialInstructions(cart.getSpecialInstructions());
        return response;
    }
}

