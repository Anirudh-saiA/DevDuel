package com.devduel.backend.controllers;

import com.devduel.backend.dtos.request.UpdateProfileRequest;
import com.devduel.backend.dtos.response.UserProfileDTO;
import com.devduel.backend.services.interfaces.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(profileService.getUserProfile(username));
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(profileService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/github/sync")
    public ResponseEntity<UserProfileDTO> syncGitHub(Authentication authentication) {
        return ResponseEntity.ok(profileService.syncGitHub(authentication.getName()));
    }

    @GetMapping("/leaderboard/commits")
    public ResponseEntity<java.util.List<UserProfileDTO>> getGitLeaderboard() {
        return ResponseEntity.ok(profileService.getGitLeaderboard());
    }
}
