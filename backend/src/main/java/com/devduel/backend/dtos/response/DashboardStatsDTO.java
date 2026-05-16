package com.devduel.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private int totalBattles;
    private int wins;
    private int losses;
    private double winRate;
    private int globalRank;
    private int currentRating;
    private List<RecentBattleDTO> recentBattles;
}
