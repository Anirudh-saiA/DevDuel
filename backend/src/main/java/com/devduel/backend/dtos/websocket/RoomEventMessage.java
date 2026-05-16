package com.devduel.backend.dtos.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomEventMessage {
    private MessageType type;
    private UUID roomId;
    private String senderUsername;
    private String content;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
