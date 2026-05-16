package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.websocket.LeaderboardUpdateMessage;
import com.devduel.backend.dtos.websocket.RoomEventMessage;
import com.devduel.backend.services.interfaces.WebSocketBroadcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketBroadcastServiceImpl implements WebSocketBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void broadcastRoomEvent(UUID roomId, RoomEventMessage event) {
        String destination = "/topic/room/" + roomId;
        log.info("Broadcasting event to {}: {}", destination, event.getType());
        messagingTemplate.convertAndSend(destination, event);
    }

    @Override
    public void broadcastLeaderboardUpdate(UUID roomId, LeaderboardUpdateMessage update) {
        String destination = "/topic/room/" + roomId + "/leaderboard";
        log.info("Broadcasting leaderboard update to {}", destination);
        messagingTemplate.convertAndSend(destination, update);
    }
}
