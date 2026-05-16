package com.devduel.backend.repositories;

import com.devduel.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    int countByRatingGreaterThan(int rating);
    java.util.List<User> findTop10ByOrderByCommitCountDesc();
}
