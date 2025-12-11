package com.platemate.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platemate.dto.TiffinProviderRequest;
import com.platemate.enums.ImageType;
import com.platemate.enums.RatingType;
import com.platemate.exception.ResourceNotFoundException;
import com.platemate.model.DeliveryZone;
import com.platemate.model.Image;
import com.platemate.model.TiffinProvider;
import com.platemate.model.User;
import com.platemate.repository.DeliveryZoneRepository;
import com.platemate.repository.ImageRepository;
import com.platemate.repository.RatingReviewRepository;
import com.platemate.repository.TiffinProviderRepository;
import com.platemate.repository.UserRepository;

@Service
public class TiffinProviderService {

    @Autowired
    private TiffinProviderRepository repository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private RatingReviewRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryZoneRepository deliveryZoneRepository;

    // ---------------- Basic CRUD ----------------
    public List<TiffinProvider> getAllProviders() {
        List<TiffinProvider> providers = repository.findAll();
        providers.forEach(this::loadExtras);
        return providers;
    }

    public Optional<TiffinProvider> getProviderById(Long id) {
        Optional<TiffinProvider> provider = repository.findById(id);
        provider.ifPresent(this::loadExtras);
        return provider;
    }

    public Optional<TiffinProvider> getByUserId(Long userId) {
        TiffinProvider provider = repository.findByUser_Id(userId);
        if (provider != null) {
            loadExtras(provider);
            return Optional.of(provider);
        }
        return Optional.empty();
    }

    public TiffinProvider createProvider(TiffinProviderRequest request) {
        TiffinProvider provider = new TiffinProvider();

        // ✅ Fetch related entities safely
        User user = userRepository.findById(request.getUser())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUser()));

        DeliveryZone zone = deliveryZoneRepository.findById(request.getZone())
                .orElseThrow(() -> new ResourceNotFoundException("Zone not found with id " + request.getZone()));

        // ✅ Set data
        provider.setUser(user);
        provider.setZone(zone);
        provider.setBusinessName(request.getBusinessName());
        provider.setDescription(request.getDescription());
        provider.setCommissionRate(request.getCommissionRate());
        provider.setProvidesDelivery(request.getProvidesDelivery());
        provider.setDeliveryRadius(request.getDeliveryRadius());
        // New providers must be reviewed by admin
        provider.setIsVerified(false);
        // New provider starts in onboarding
        provider.setIsOnboarding(true);

        // ✅ Save
        return repository.save(provider);
    }

    public TiffinProvider updateProvider(Long id, TiffinProvider provider) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setBusinessName(provider.getBusinessName());
                    existing.setDescription(provider.getDescription());
                    existing.setCommissionRate(provider.getCommissionRate());
                    existing.setProvidesDelivery(provider.getProvidesDelivery());
                    existing.setDeliveryRadius(provider.getDeliveryRadius());
                    existing.setIsVerified(provider.getIsVerified());
                    existing.setZone(provider.getZone()); // allow updating zone
                    return repository.save(existing);
                })
                .orElseThrow(() -> new ResourceNotFoundException("TiffinProvider not found with id " + id));
    }

    public void deleteProvider(Long id) {
        repository.deleteById(id);
    }

    // ---------------- Approval Workflow ----------------
    public java.util.List<TiffinProvider> getPendingProviders() {
        return repository.findAllByIsVerified(false);
    }

    public TiffinProvider approveProvider(Long providerId) {
        TiffinProvider provider = repository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("TiffinProvider not found with id " + providerId));
        provider.setIsVerified(true);
        return repository.save(provider);
    }

    public TiffinProvider rejectProvider(Long providerId) {
        // For now, mark as deleted; can be extended to store rejection reasons
        TiffinProvider provider = repository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("TiffinProvider not found with id " + providerId));
        provider.setIsVerified(false);
        provider.setIsDeleted(true);
        return repository.save(provider);
    }

    // ---------------- Load profile image, place images, ratings, zone ----------------
    @Transactional(readOnly = true)
    private void loadExtras(TiffinProvider provider) {
        Long imageId = imageRepository.findIdByImageTypeAndOwnerId(ImageType.PROVIDER_PROFILE, provider.getId());
        if (imageId != null) {
            Image profileImage = imageRepository.findById(imageId).get();
            provider.setProfileImage(profileImage);
        }
        provider.setRatings(
            ratingRepository.findByRatingTypeAndTargetId(RatingType.COOK_RATING, provider.getId())
        );
        // Optionally fetch zone details (already lazy loaded)
        if (provider.getZone() != null) {
            provider.setZone(deliveryZoneRepository.findById(provider.getZone().getId())
                    .orElse(null));
        }
    }

    // ---------------- DeliveryZone related methods ----------------

    /**
     * Assign a DeliveryZone to a TiffinProvider
     */
    public TiffinProvider assignZone(Long providerId, Long zoneId) {
        TiffinProvider provider = repository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("TiffinProvider not found with id " + providerId));

        return deliveryZoneRepository.findById(zoneId)
                .map(zone -> {
                    provider.setZone(zone);
                    return repository.save(provider);
                })
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryZone not found with id " + zoneId));
    }

    /**
     * Change the zone of an existing TiffinProvider
     */
    public TiffinProvider changeZone(Long providerId, Long newZoneId) {
        return assignZone(providerId, newZoneId);
    }

    // ---------------- Auto-create Provider on Signup ----------------

    /**
     * Create a TiffinProvider with default values for new provider signup
     * This is called automatically when a PROVIDER user signs up
     */
    @Transactional
    public TiffinProvider createProviderWithDefaults(User user) {
        // Get or create a default zone
        DeliveryZone defaultZone = getOrCreateDefaultZone();
        
        TiffinProvider provider = new TiffinProvider();
        provider.setUser(user);
        provider.setZone(defaultZone);
        
        // Set default/placeholder values
        provider.setBusinessName("My Tiffin Service"); // Placeholder, will be updated during onboarding
        provider.setDescription(""); // Empty, will be filled during onboarding
        provider.setCommissionRate(0.00);
        provider.setProvidesDelivery(false);
        provider.setDeliveryRadius(null);
        
        // New providers must be reviewed by admin
        provider.setIsVerified(false);
        // New provider starts in onboarding
        provider.setIsOnboarding(true);
        provider.setIsDeleted(false);
        
        return repository.save(provider);
    }

    /**
     * Get or create a default delivery zone
     * Creates a default zone if none exist, or returns the first one
     */
    private DeliveryZone getOrCreateDefaultZone() {
        List<DeliveryZone> allZones = deliveryZoneRepository.findAll();
        
        // If zones exist, try to find one named "Default" or use the first one
        if (!allZones.isEmpty()) {
            // Look for a zone with name containing "Default"
            Optional<DeliveryZone> defaultZone = allZones.stream()
                .filter(zone -> zone.getZoneName().toLowerCase().contains("default"))
                .findFirst();
            
            if (defaultZone.isPresent()) {
                return defaultZone.get();
            }
            
            // If no default zone found, use the first available zone
            return allZones.get(0);
        }
        
        // If no zones exist at all, create a default one
        DeliveryZone newDefaultZone = new DeliveryZone();
        newDefaultZone.setZoneName("Default Zone");
        newDefaultZone.setCity("Default City");
        newDefaultZone.setPincodeRanges("[]"); // Empty JSON array
        return deliveryZoneRepository.save(newDefaultZone);
    }
}

