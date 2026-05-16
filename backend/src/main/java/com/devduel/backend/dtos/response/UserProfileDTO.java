package com.devduel.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String githubUsername;
    private Integer commitCount;
    private int rating;
    private int globalRank;
    private int totalBattles;
    private double winRate;
    private List<String> achievements;
    private List<RecentBattleDTO> recentBattles;
    private LocalDateTime memberSince;
}
