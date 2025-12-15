package com.cooktodor.repository;

import com.cooktodor.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findAllByUser_IdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);
    
    List<Notification> findAllByUser_IdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);
    
    Long countByUser_IdAndIsReadFalseAndIsDeletedFalse(Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isDeleted = false ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
}


