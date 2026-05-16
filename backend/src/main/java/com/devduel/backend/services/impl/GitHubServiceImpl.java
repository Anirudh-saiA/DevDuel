package com.devduel.backend.services.impl;

import com.devduel.backend.services.interfaces.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GitHubServiceImpl implements GitHubService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public int fetchCommitCount(String githubUsername) {
        if (githubUsername == null || githubUsername.isEmpty()) {
            return 0;
        }

        try {
            String url = "https://api.github.com/search/commits?q=author:" + githubUsername;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github.cloak-preview");
            headers.set("User-Agent", "DevDuel-App");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Integer) response.getBody().get("total_count");
            }
        } catch (Exception e) {
            // Log error and return 0 or previous count
            System.err.println("Failed to fetch GitHub commits for " + githubUsername + ": " + e.getMessage());
        }
        
        return 0;
    }
}
