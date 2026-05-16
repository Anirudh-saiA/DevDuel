package com.devduel.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentBattleDTO {
    private UUID roomId;
    private String roomName;
    private String result; // WIN, LOSS, DRAW
    private LocalDateTime date;
    private int ratingChange;
}
