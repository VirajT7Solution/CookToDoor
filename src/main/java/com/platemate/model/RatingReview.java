package com.platemate.model;

import com.platemate.enums.RatingType;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings_reviews")
@AttributeOverride(name = "id", column = @Column(name = "review_id"))
public class RatingReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "rating_type", nullable = false)
    private RatingType ratingType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1-5

    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        if (isDeleted == null) isDeleted = false;
    }

    public RatingReview() {
    }

    public RatingReview(Customer customer, RatingType ratingType, Integer rating, String reviewText,
            Boolean isDeleted, Long targetId) {
        this.customer = customer;
        this.ratingType = ratingType;
        this.rating = rating;
        this.reviewText = reviewText;
        this.isDeleted = isDeleted;
        this.targetId = targetId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public RatingType getRatingType() {
        return ratingType;
    }

    public void setRatingType(RatingType ratingType) {
        this.ratingType = ratingType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
