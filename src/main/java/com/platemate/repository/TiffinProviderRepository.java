package com.platemate.repository;

import com.platemate.model.TiffinProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiffinProviderRepository extends JpaRepository<TiffinProvider, Long> {
    // Custom query if needed, e.g., find by userId
    TiffinProvider findByUser_Id(Long userId);

    java.util.List<TiffinProvider> findAllByIsVerified(Boolean isVerified);

    java.util.Optional<TiffinProvider> findByIdAndUser_Id(Long id, Long userId);
}

