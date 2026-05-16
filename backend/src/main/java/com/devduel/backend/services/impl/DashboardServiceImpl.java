package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.response.DashboardStatsDTO;
import com.devduel.backend.dtos.response.RecentBattleDTO;
import com.devduel.backend.models.Room;
import com.devduel.backend.models.RoomParticipant;
import com.devduel.backend.models.User;
import com.devduel.backend.repositories.RoomParticipantRepository;
import com.devduel.backend.repositories.RoomRepository;
import com.devduel.backend.repositories.UserRepository;
import com.devduel.backend.services.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomParticipantRepository participantRepository;

    @Override
    public DashboardStatsDTO getDashboardStats(String identifier) {
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with identifier: " + identifier)));

        int totalBattles = participantRepository.countByUserAndRoomStatus(user, "FINISHED");
        int wins = roomRepository.countByWinnerId(user.getId());
        int losses = totalBattles - wins; // Simplified for MVP (assumes 1v1 and no draws)
        
        double winRate = totalBattles == 0 ? 0.0 : ((double) wins / totalBattles) * 100.0;
        
        // Calculate rank: Number of users with a higher rating + 1
        int usersWithHigherRating = userRepository.countByRatingGreaterThan(user.getRating());
        int globalRank = usersWithHigherRating + 1;

        List<RoomParticipant> recentParticipants = participantRepository
                .findTop5ByUserAndRoomStatusOrderByRoomFinishedAtDesc(user, "FINISHED");

        List<RecentBattleDTO> recentBattles = recentParticipants.stream().map(rp -> {
            Room room = rp.getRoom();
            String result = "DRAW";
            if (room.getWinnerId() != null) {
                result = room.getWinnerId().equals(user.getId()) ? "WIN" : "LOSS";
            }
            
            return RecentBattleDTO.builder()
                    .roomId(room.getId())
                    .roomName(room.getName())
                    .result(result)
                    .date(room.getFinishedAt())
                    .ratingChange(result.equals("WIN") ? 25 : (result.equals("LOSS") ? -15 : 0)) // Mock rating change logic
                    .build();
        }).collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalBattles(totalBattles)
                .wins(wins)
                .losses(losses)
                .winRate(Math.round(winRate * 10.0) / 10.0) // Round to 1 decimal
                .globalRank(globalRank)
                .currentRating(user.getRating())
                .recentBattles(recentBattles)
                .build();
    }
}
