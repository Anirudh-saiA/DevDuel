package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.request.LoginRequest;
import com.devduel.backend.dtos.request.RegisterRequest;
import com.devduel.backend.dtos.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
