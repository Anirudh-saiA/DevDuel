package com.devduel.backend.dtos.response;

import com.devduel.backend.models.QuestionDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private UUID id;
    private String title;
    private String description;
    private QuestionDifficulty difficulty;
    private List<String> examples;
    private List<String> constraints;
    private String expectedOutput;
    private UUID contestId;
    private LocalDateTime createdAt;
}
