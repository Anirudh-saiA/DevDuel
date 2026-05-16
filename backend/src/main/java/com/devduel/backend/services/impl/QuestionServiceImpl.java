package com.devduel.backend.services.impl;

import com.devduel.backend.dtos.request.CreateQuestionRequest;
import com.devduel.backend.dtos.response.QuestionDTO;
import com.devduel.backend.models.Question;
import com.devduel.backend.models.QuestionDifficulty;
import com.devduel.backend.repositories.QuestionRepository;
import com.devduel.backend.services.interfaces.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public QuestionDTO addQuestion(CreateQuestionRequest request) {
        Question question = Question.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .examples(request.getExamples())
                .constraints(request.getConstraints())
                .expectedOutput(request.getExpectedOutput())
                .contestId(request.getContestId())
                .createdAt(LocalDateTime.now())
                .build();

        question = questionRepository.save(question);
        return mapToDTO(question);
    }

    @Override
    public List<QuestionDTO> getAllQuestions(QuestionDifficulty difficulty) {
        List<Question> questions;
        if (difficulty != null) {
            questions = questionRepository.findByDifficulty(difficulty);
        } else {
            questions = questionRepository.findAll();
        }
        return questions.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getQuestionsByContest(UUID contestId) {
        return questionRepository.findByContestId(contestId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionDTO assignToContest(UUID questionId, UUID contestId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));
        
        question.setContestId(contestId);
        question = questionRepository.save(question);
        
        return mapToDTO(question);
    }

    @Override
    public QuestionDTO getQuestionDetails(UUID questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));
        return mapToDTO(question);
    }

    private QuestionDTO mapToDTO(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .difficulty(question.getDifficulty())
                .examples(question.getExamples())
                .constraints(question.getConstraints())
                .expectedOutput(question.getExpectedOutput())
                .contestId(question.getContestId())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
