package com.devduel.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private UUID id;
    private String roomCode;
    private String name;
    private boolean isPrivate;
    private UserDTO host;
    private int maxPlayers;
    private String status;
    private LocalDateTime createdAt;
    private List<RoomParticipantDTO> participants;
}
