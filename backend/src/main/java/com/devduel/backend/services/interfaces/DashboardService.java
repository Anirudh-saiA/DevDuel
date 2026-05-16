package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.response.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getDashboardStats(String userEmail);
}
