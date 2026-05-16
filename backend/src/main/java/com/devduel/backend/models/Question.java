package com.devduel.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionDifficulty difficulty;

    @ElementCollection
    @CollectionTable(name = "question_examples", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "example", columnDefinition = "TEXT")
    private List<String> examples;

    @ElementCollection
    @CollectionTable(name = "question_constraints", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "constraint_text", columnDefinition = "TEXT")
    private List<String> constraints;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    // Optional assignment to a specific contest (null if unassigned)
    private UUID contestId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
