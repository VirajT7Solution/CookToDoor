package com.platemate.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.platemate.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    @Query(value = "SELECT * FROM users WHERE username = :username ORDER BY id DESC LIMIT 1", nativeQuery = true)
    User getUserDetailsByUsername(@Param("username") String username);

}
