package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.response.PlatformAnalyticsDTO;

import java.util.UUID;

public interface AdminService {
    void toggleUserBan(UUID userId);
    void deleteRoom(UUID roomId);
    void deleteQuestion(UUID questionId);
    PlatformAnalyticsDTO getPlatformAnalytics();
}
