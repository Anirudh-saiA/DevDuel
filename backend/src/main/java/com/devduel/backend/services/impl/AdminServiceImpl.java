package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.response.PlatformAnalyticsDTO;
import com.devduel.backend.models.User;
import com.devduel.backend.repositories.QuestionRepository;
import com.devduel.backend.repositories.RoomRepository;
import com.devduel.backend.repositories.UserRepository;
import com.devduel.backend.services.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public void toggleUserBan(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteRoom(UUID roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Room not found");
        }
        roomRepository.deleteById(roomId);
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new IllegalArgumentException("Question not found");
        }
        questionRepository.deleteById(questionId);
    }

    @Override
    public PlatformAnalyticsDTO getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long totalQuestions = questionRepository.count();
        
        // Count active rooms (WAITING or IN_PROGRESS)
        // For simplicity with existing repository methods, we can just do a custom query if needed
        // but for MVP, let's just do an approximate count using findAll (in a real app, use @Query)
        long totalActiveRooms = roomRepository.findAll().stream()
                .filter(r -> r.getStatus().equals("WAITING") || r.getStatus().equals("IN_PROGRESS"))
                .count();

        long totalFinishedBattles = roomRepository.findAll().stream()
                .filter(r -> r.getStatus().equals("FINISHED"))
                .count();

        return PlatformAnalyticsDTO.builder()
                .totalUsers(totalUsers)
                .totalActiveRooms(totalActiveRooms)
                .totalQuestions(totalQuestions)
                .totalFinishedBattles(totalFinishedBattles)
                .build();
    }
}
