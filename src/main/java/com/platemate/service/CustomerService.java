package com.platemate.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.enums.ImageType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.Customer;
import com.platemate.model.Image;
import com.platemate.model.User;
import com.platemate.repository.CustomerRepository;
import com.platemate.repository.ImageRepository;
import com.platemate.repository.UserRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageRepository imageRepository;

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> listActive() {
        List<Customer> customers = customerRepository.findAllByIsDeletedFalse();
        customers.forEach(this::loadExtras);
        return customers;
    }

    public Optional<Customer> getById(Long id) {
        Optional<Customer> customer = customerRepository.findById(id).filter(c -> !Boolean.TRUE.equals(c.getIsDeleted()));
        customer.ifPresent(this::loadExtras);
        return customer;
    }
    
    public Optional<Customer> getByUserId(Long userId) {
        Optional<Customer> customer = customerRepository.findByUser_IdAndIsDeletedFalse(userId);
        customer.ifPresent(this::loadExtras);
        return customer;
    }
    
    // ---------------- Load profile image (similar to provider's loadExtras) ----------------
    private void loadExtras(Customer customer) {
        Long imageId = imageRepository.findIdByImageTypeAndOwnerId(ImageType.CUSTOMER_PROFILE, customer.getId());
        if (imageId != null) {
            Image profileImage = imageRepository.findById(imageId).orElse(null);
            customer.setProfileImage(profileImage);
        }
    }

    public Customer update(Long id, Customer update) {
        return customerRepository.findById(id).map(c -> {
            if (update.getFullName() != null) c.setFullName(update.getFullName());
            if (update.getDateOfBirth() != null) c.setDateOfBirth(update.getDateOfBirth());
            return customerRepository.save(c);
        }).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }

    public void softDelete(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        c.setIsDeleted(true);
        customerRepository.save(c);
    }

    public User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    // ---------------- Auto-create Customer on Signup ----------------

    /**
     * Create a Customer with default values for new customer signup
     * This is called automatically when a CUSTOMER user signs up
     */
    @Transactional
    public Customer createCustomerWithDefaults(User user) {
        Customer customer = new Customer();
        customer.setUser(user);
        
        // Set default/placeholder values
        // Use username as default full name (can be updated later during profile setup)
        customer.setFullName(user.getUsername()); // Placeholder, will be updated during onboarding
        customer.setDateOfBirth(null); // Optional, can be set later
        customer.setIsDeleted(false);
        
        return customerRepository.save(customer);
    }
}


