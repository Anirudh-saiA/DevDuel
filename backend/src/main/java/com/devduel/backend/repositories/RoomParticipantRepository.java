package com.devduel.backend.repositories;

import com.devduel.backend.models.Room;
import com.devduel.backend.models.RoomParticipant;
import com.devduel.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, UUID> {
    boolean existsByRoomAndUser(Room room, User user);
    Optional<RoomParticipant> findByRoomAndUser(Room room, User user);
    void deleteByRoomAndUser(Room room, User user);
    int countByUserAndRoomStatus(User user, String status);
    List<RoomParticipant> findTop5ByUserAndRoomStatusOrderByRoomFinishedAtDesc(User user, String status);
}
