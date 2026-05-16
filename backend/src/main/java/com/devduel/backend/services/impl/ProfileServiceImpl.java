package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.request.UpdateProfileRequest;
import com.devduel.backend.dtos.response.RecentBattleDTO;
import com.devduel.backend.dtos.response.UserProfileDTO;
import com.devduel.backend.models.Room;
import com.devduel.backend.models.RoomParticipant;
import com.devduel.backend.models.User;
import com.devduel.backend.repositories.RoomParticipantRepository;
import com.devduel.backend.repositories.RoomRepository;
import com.devduel.backend.repositories.UserRepository;
import com.devduel.backend.services.interfaces.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomParticipantRepository participantRepository;
    private final GitHubService githubService;

    @Override
    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        int totalBattles = participantRepository.countByUserAndRoomStatus(user, "FINISHED");
        int wins = roomRepository.countByWinnerId(user.getId());
        double winRate = totalBattles == 0 ? 0.0 : ((double) wins / totalBattles) * 100.0;
        
        int globalRank = userRepository.countByRatingGreaterThan(user.getRating()) + 1;

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
                    .ratingChange(result.equals("WIN") ? 25 : (result.equals("LOSS") ? -15 : 0))
                    .build();
        }).collect(Collectors.toList());

        return UserProfileDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .githubUsername(user.getGithubUsername())
                .commitCount(user.getCommitCount())
                .rating(user.getRating())
                .globalRank(globalRank)
                .totalBattles(totalBattles)
                .winRate(Math.round(winRate * 10.0) / 10.0)
                .achievements(user.getAchievements())
                .recentBattles(recentBattles)
                .memberSince(user.getCreatedAt())
                .build();
    }

    @Override
    public UserProfileDTO updateProfile(String currentUsername, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setGithubUsername(request.getGithubUsername());
        
        userRepository.save(user);

        return getUserProfile(user.getUsername());
    }

    @Override
    public UserProfileDTO syncGitHub(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseGet(() -> userRepository.findByEmail(currentUsername)
                        .orElseThrow(() -> new IllegalArgumentException("User not found")));

        if (user.getGithubUsername() != null && !user.getGithubUsername().isEmpty()) {
            int count = githubService.fetchCommitCount(user.getGithubUsername());
            user.setCommitCount(count);
            user.setLastGithubSync(java.time.LocalDateTime.now());
            userRepository.save(user);
        }

        return getUserProfile(user.getUsername());
    }

    @Override
    public java.util.List<UserProfileDTO> getGitLeaderboard() {
        return userRepository.findTop10ByOrderByCommitCountDesc()
                .stream()
                .map(u -> getUserProfile(u.getUsername()))
                .collect(java.util.stream.Collectors.toList());
    }
}
