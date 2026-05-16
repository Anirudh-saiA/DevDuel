package com.devduel.backend.controllers;

import com.devduel.backend.dtos.response.PlatformAnalyticsDTO;
import com.devduel.backend.services.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<Void> toggleUserBan(@PathVariable UUID userId) {
        adminService.toggleUserBan(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID roomId) {
        adminService.deleteRoom(roomId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID questionId) {
        adminService.deleteQuestion(questionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<PlatformAnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(adminService.getPlatformAnalytics());
    }
}
