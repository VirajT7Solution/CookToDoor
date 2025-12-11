package com.platemate.controller;

import com.platemate.model.DeliveryZone;
import com.platemate.model.TiffinProvider;
import com.platemate.service.DeliveryZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-zones")
public class DeliveryZoneController {

    @Autowired
    private DeliveryZoneService service;

    // ---------------- CRUD ----------------
    @GetMapping
    public ResponseEntity<List<DeliveryZone>> getAllZones() {
        return ResponseEntity.ok(service.getAllZones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryZone> getZoneById(@PathVariable Long id) {
        return service.getZoneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DeliveryZone> createZone(@RequestBody DeliveryZone zone) {
        return ResponseEntity.ok(service.createZone(zone));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryZone> updateZone(@PathVariable Long id, @RequestBody DeliveryZone zone) {
        try {
            return ResponseEntity.ok(service.updateZone(id, zone));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        service.deleteZone(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- Assign Zone to TiffinProvider ----------------
    @PostMapping("/{zoneId}/assign/{providerId}")
    public ResponseEntity<TiffinProvider> assignZoneToProvider(
            @PathVariable Long zoneId,
            @PathVariable Long providerId) {
        try {
            TiffinProvider provider = service.assignZoneToProvider(providerId, zoneId);
            return ResponseEntity.ok(provider);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}