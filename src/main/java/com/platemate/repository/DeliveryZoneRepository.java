package com.platemate.repository;

import com.platemate.model.DeliveryZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryZoneRepository extends JpaRepository<DeliveryZone, Long> {
    // Optional: find by city or name if needed
}