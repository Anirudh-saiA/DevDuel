package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.request.LoginRequest;
import com.devduel.backend.dtos.request.RegisterRequest;
import com.devduel.backend.dtos.response.AuthResponse;
import com.devduel.backend.dtos.response.UserDTO;
import com.devduel.backend.models.Role;
import com.devduel.backend.models.User;
import com.devduel.backend.repositories.UserRepository;
import com.devduel.backend.services.interfaces.AuthService;
import com.devduel.backend.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .rating(1200)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String jwtToken = jwtUtils.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDTO(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseGet(() -> userRepository.findByUsername(request.getIdentifier())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid email or password")));

        String jwtToken = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDTO(user))
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .rating(user.getRating())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
