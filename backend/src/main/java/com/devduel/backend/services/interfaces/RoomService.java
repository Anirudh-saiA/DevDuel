package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.request.CreateRoomRequest;
import com.devduel.backend.dtos.response.RoomResponse;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    RoomResponse createRoom(CreateRoomRequest request, String userEmail);
    RoomResponse joinRoom(String roomCode, String userEmail);
    void leaveRoom(UUID roomId, String userEmail);
    List<RoomResponse> getPublicRooms();
    RoomResponse getRoomDetails(UUID roomId);
}
