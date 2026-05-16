package com.devduel.backend.websockets;

import com.devduel.backend.dtos.websocket.MessageType;
import com.devduel.backend.dtos.websocket.RoomEventMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class RoomWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room/{roomId}/chat")
    public void handleChatMessage(
            @DestinationVariable UUID roomId,
            @Payload RoomEventMessage message,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        // Ensure the sender identity is secure from the token, not just the payload
        if (headerAccessor.getUser() != null) {
            message.setSenderUsername(headerAccessor.getUser().getName());
        }
        
        message.setType(MessageType.CHAT);
        message.setTimestamp(LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
    }

    @MessageMapping("/room/{roomId}/ready")
    public void handleReadyState(
            @DestinationVariable UUID roomId,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Unknown";
        
        RoomEventMessage event = RoomEventMessage.builder()
                .type(MessageType.JOIN)
                .roomId(roomId)
                .senderUsername(username)
                .content(username + " is ready!")
                .build();
                
        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }
}
