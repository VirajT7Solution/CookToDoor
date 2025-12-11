package com.platemate.service;

import com.platemate.model.DeliveryZone;
import com.platemate.model.TiffinProvider;
import com.platemate.repository.DeliveryZoneRepository;
import com.platemate.repository.TiffinProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryZoneService {

    @Autowired
    private DeliveryZoneRepository deliveryZoneRepository;

    @Autowired
    private TiffinProviderRepository tiffinProviderRepository;

    // ---------------- CRUD for DeliveryZone ----------------

    public List<DeliveryZone> getAllZones() {
        return deliveryZoneRepository.findAll();
    }

    public Optional<DeliveryZone> getZoneById(Long id) {
        return deliveryZoneRepository.findById(id);
    }

    public DeliveryZone createZone(DeliveryZone zone) {
        return deliveryZoneRepository.save(zone);
    }

    public DeliveryZone updateZone(Long id, DeliveryZone zone) {
        return deliveryZoneRepository.findById(id)
                .map(existing -> {
                    existing.setZoneName(zone.getZoneName());
                    existing.setCity(zone.getCity());
                    existing.setPincodeRanges(zone.getPincodeRanges());
                    existing.setActive(zone.isActive());
                    return deliveryZoneRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("DeliveryZone not found with id " + id));
    }

    public void deleteZone(Long id) {
        deliveryZoneRepository.deleteById(id);
    }

    // ---------------- TiffinProvider integration ----------------
    public TiffinProvider assignZoneToProvider(Long tiffinProviderId, Long zoneId) {
        TiffinProvider provider = tiffinProviderRepository.findById(tiffinProviderId)
                .orElseThrow(() -> new RuntimeException("TiffinProvider not found with id " + tiffinProviderId));

        DeliveryZone zone = deliveryZoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("DeliveryZone not found with id " + zoneId));

        provider.setZone(zone);
        return tiffinProviderRepository.save(provider);
    }
}
