package com.devduel.backend.controllers;

import com.devduel.backend.dtos.request.CreateQuestionRequest;
import com.devduel.backend.dtos.response.QuestionDTO;
import com.devduel.backend.models.QuestionDifficulty;
import com.devduel.backend.services.interfaces.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDTO> addQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        // Normally protected by @PreAuthorize("hasRole('ADMIN')")
        return ResponseEntity.ok(questionService.addQuestion(request));
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions(
            @RequestParam(required = false) QuestionDifficulty difficulty
    ) {
        return ResponseEntity.ok(questionService.getAllQuestions(difficulty));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionDetails(@PathVariable UUID questionId) {
        return ResponseEntity.ok(questionService.getQuestionDetails(questionId));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByContest(@PathVariable UUID contestId) {
        return ResponseEntity.ok(questionService.getQuestionsByContest(contestId));
    }

    @PutMapping("/{questionId}/contest/{contestId}")
    public ResponseEntity<QuestionDTO> assignToContest(
            @PathVariable UUID questionId,
            @PathVariable UUID contestId
    ) {
        // Normally protected by @PreAuthorize("hasRole('ADMIN')")
        return ResponseEntity.ok(questionService.assignToContest(questionId, contestId));
    }
}
