package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.PostStatsDTO;
import com.forum.forum_backend.service.PostStatsService;
import com.forum.forum_backend.utility.StatsType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {
    private final PostStatsService postStatsService;
    @GetMapping("/stats/posts")
    public ResponseEntity<List<PostStatsDTO>> getPostsStats(@RequestParam("year") String year){
        return ResponseEntity.ok(postStatsService.getStatsForType(StatsType.POST,year));
    }
    @GetMapping("/stats/users")
    public ResponseEntity<List<PostStatsDTO>> getUsersStats(@RequestParam("year") String year){
        return ResponseEntity.ok(postStatsService.getStatsForType(StatsType.USER,year));
    }
    @GetMapping("/stats")
    public ResponseEntity<List<PostStatsDTO>> getStats(@RequestParam("year") String year,@RequestParam("type") StatsType type){
        return ResponseEntity.ok(postStatsService.getStatsForType(type,year));
    }
}
