package com.devduel.backend.services.interfaces;

import com.devduel.backend.dtos.request.CreateQuestionRequest;
import com.devduel.backend.dtos.response.QuestionDTO;
import com.devduel.backend.models.QuestionDifficulty;

import java.util.List;
import java.util.UUID;

public interface QuestionService {
    QuestionDTO addQuestion(CreateQuestionRequest request);
    List<QuestionDTO> getAllQuestions(QuestionDifficulty difficulty);
    List<QuestionDTO> getQuestionsByContest(UUID contestId);
    QuestionDTO assignToContest(UUID questionId, UUID contestId);
    QuestionDTO getQuestionDetails(UUID questionId);
}
