package com.devduel.backend.dtos.request;

import com.devduel.backend.models.QuestionDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuestionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private QuestionDifficulty difficulty;

    private List<String> examples;
    private List<String> constraints;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    private UUID contestId;
}
