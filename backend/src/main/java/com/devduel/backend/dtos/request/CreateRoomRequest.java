package com.devduel.backend.dtos.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomRequest {

    @NotBlank(message = "Room name is required")
    private String name;

    private boolean isPrivate;

    @Min(value = 2, message = "Minimum players is 2")
    @Max(value = 10, message = "Maximum players is 10")
    @Builder.Default
    private int maxPlayers = 2;
}
