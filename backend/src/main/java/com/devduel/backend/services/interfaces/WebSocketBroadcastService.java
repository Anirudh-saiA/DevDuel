package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.websocket.LeaderboardUpdateMessage;
import com.devduel.backend.dtos.websocket.RoomEventMessage;

import java.util.UUID;

public interface WebSocketBroadcastService {
    void broadcastRoomEvent(UUID roomId, RoomEventMessage event);
    void broadcastLeaderboardUpdate(UUID roomId, LeaderboardUpdateMessage update);
}
