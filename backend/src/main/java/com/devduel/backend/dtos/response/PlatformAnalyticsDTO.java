package com.devduel.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlatformAnalyticsDTO {
    private long totalUsers;
    private long totalActiveRooms;
    private long totalQuestions;
    private long totalFinishedBattles;
}
