package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.request.UpdateProfileRequest;
import com.devduel.backend.dtos.response.UserProfileDTO;

public interface ProfileService {
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateProfile(String currentUsername, UpdateProfileRequest request);
    UserProfileDTO syncGitHub(String currentUsername);
    java.util.List<UserProfileDTO> getGitLeaderboard();
}
