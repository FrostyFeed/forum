package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.BestScoreEverDTO;
import com.forum.forum_backend.dto.MonthlyScoreDTO;
import com.forum.forum_backend.service.MonthlyScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {
    private final MonthlyScoreService monthlyScoreService;

    @GetMapping("/leaderboards/monthly")
    public ResponseEntity<List<MonthlyScoreDTO>> getMonthlyScore(){
        return ResponseEntity.ok(monthlyScoreService.getTopScores());
    }
    @GetMapping("/leaderboards/ever")
    public ResponseEntity<List<BestScoreEverDTO>> getAllTimeBestScore(){
        return ResponseEntity.ok(monthlyScoreService.getTopScoreEver());
    }
}
