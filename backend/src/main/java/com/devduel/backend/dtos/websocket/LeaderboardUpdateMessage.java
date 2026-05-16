package com.devduel.backend.dtos.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardUpdateMessage {
    private UUID roomId;
    private Map<String, Integer> playerScores; // Username -> Score

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
