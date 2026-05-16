package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.request.CreateRoomRequest;
import com.devduel.backend.dtos.response.RoomParticipantDTO;
import com.devduel.backend.dtos.response.RoomResponse;
import com.devduel.backend.dtos.response.UserDTO;
import com.devduel.backend.models.Room;
import com.devduel.backend.models.RoomParticipant;
import com.devduel.backend.models.User;
import com.devduel.backend.repositories.RoomParticipantRepository;
import com.devduel.backend.repositories.RoomRepository;
import com.devduel.backend.repositories.UserRepository;
import com.devduel.backend.services.interfaces.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomParticipantRepository participantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request, String userEmail) {
        User host = getUserByEmail(userEmail);

        Room room = Room.builder()
                .roomCode(generateUniqueRoomCode())
                .name(request.getName())
                .isPrivate(request.isPrivate())
                .host(host)
                .maxPlayers(request.getMaxPlayers())
                .status("WAITING")
                .createdAt(LocalDateTime.now())
                .build();

        room = roomRepository.save(room);

        RoomParticipant participant = RoomParticipant.builder()
                .room(room)
                .user(host)
                .isReady(true) // Host is ready by default
                .joinedAt(LocalDateTime.now())
                .build();

        participantRepository.save(participant);
        room.getParticipants().add(participant);

        return mapToRoomResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse joinRoom(String roomCode, String userEmail) {
        User user = getUserByEmail(userEmail);
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        if (!room.getStatus().equals("WAITING")) {
            throw new IllegalArgumentException("Room is already in progress or finished");
        }

        if (room.getParticipants().size() >= room.getMaxPlayers()) {
            throw new IllegalArgumentException("Room is full");
        }

        if (participantRepository.existsByRoomAndUser(room, user)) {
            throw new IllegalArgumentException("You are already in this room");
        }

        RoomParticipant participant = RoomParticipant.builder()
                .room(room)
                .user(user)
                .isReady(false)
                .joinedAt(LocalDateTime.now())
                .build();

        participantRepository.save(participant);
        room.getParticipants().add(participant);

        return mapToRoomResponse(room);
    }

    @Override
    @Transactional
    public void leaveRoom(UUID roomId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        if (!participantRepository.existsByRoomAndUser(room, user)) {
            throw new IllegalArgumentException("You are not a participant of this room");
        }

        participantRepository.deleteByRoomAndUser(room, user);

        // If host leaves, cancel the room
        if (room.getHost().getId().equals(user.getId())) {
            room.setStatus("CANCELLED");
            roomRepository.save(room);
        }
    }

    @Override
    public List<RoomResponse> getPublicRooms() {
        return roomRepository.findByIsPrivateFalseAndStatus("WAITING").stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomDetails(UUID roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        return mapToRoomResponse(room);
    }

    private User getUserByEmail(String identifier) {
        return userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with identifier: " + identifier)));
    }

    private String generateUniqueRoomCode() {
        String code;
        do {
            code = generateRandomCode(6);
        } while (roomRepository.findByRoomCode(code).isPresent());
        return code;
    }

    private String generateRandomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private RoomResponse mapToRoomResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomCode(room.getRoomCode())
                .name(room.getName())
                .isPrivate(room.isPrivate())
                .host(mapToUserDTO(room.getHost()))
                .maxPlayers(room.getMaxPlayers())
                .status(room.getStatus())
                .createdAt(room.getCreatedAt())
                .participants(room.getParticipants().stream()
                        .map(this::mapToParticipantDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .rating(user.getRating())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private RoomParticipantDTO mapToParticipantDTO(RoomParticipant participant) {
        return RoomParticipantDTO.builder()
                .id(participant.getId())
                .user(mapToUserDTO(participant.getUser()))
                .isReady(participant.isReady())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
