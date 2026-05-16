package com.devduel.backend.controllers;

import com.devduel.backend.dtos.request.CreateRoomRequest;
import com.devduel.backend.dtos.request.JoinRoomRequest;
import com.devduel.backend.dtos.response.RoomResponse;
import com.devduel.backend.services.interfaces.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(roomService.createRoom(request, authentication.getName()));
    }

    @PostMapping("/join")
    public ResponseEntity<RoomResponse> joinRoom(
            @Valid @RequestBody JoinRoomRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(roomService.joinRoom(request.getRoomCode(), authentication.getName()));
    }

    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable UUID roomId,
            Authentication authentication
    ) {
        roomService.leaveRoom(roomId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<RoomResponse>> getPublicRooms() {
        return ResponseEntity.ok(roomService.getPublicRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoomDetails(@PathVariable UUID roomId) {
        return ResponseEntity.ok(roomService.getRoomDetails(roomId));
    }
}
