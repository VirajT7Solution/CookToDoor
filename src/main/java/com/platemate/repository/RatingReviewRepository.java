package com.platemate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.enums.RatingType;
import com.platemate.model.RatingReview;

public interface RatingReviewRepository extends JpaRepository<RatingReview, Long> {
    List<RatingReview> findAllByIsDeletedFalse();
    
    List<RatingReview> findByRatingTypeAndTargetId(RatingType ratingType, Long targetId);
    
    // Check if customer already rated this item
    Optional<RatingReview> findByCustomer_IdAndRatingTypeAndTargetIdAndIsDeletedFalse(
        Long customerId, RatingType ratingType, Long targetId);
    
    // Get all reviews with customer info (excluding deleted)
    @Query("SELECT rr FROM RatingReview rr JOIN FETCH rr.customer WHERE rr.ratingType = :type AND rr.targetId = :targetId AND rr.isDeleted = false ORDER BY rr.createdAt DESC")
    List<RatingReview> findReviewsWithCustomer(@Param("type") RatingType type, @Param("targetId") Long targetId);
}