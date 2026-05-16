package com.devduel.backend.repositories;

import com.devduel.backend.models.Question;
import com.devduel.backend.models.QuestionDifficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByDifficulty(QuestionDifficulty difficulty);
    List<Question> findByContestId(UUID contestId);
}
