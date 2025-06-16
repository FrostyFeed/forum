package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.CreateNewsReactionDTO;
import com.forum.forum_backend.service.NewsReactionsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news/reaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NewsReactionController {
    private final NewsReactionsService newsReactionsService;
    @PostMapping
    public ResponseEntity<String> createReaction(@RequestBody CreateNewsReactionDTO reactionDTO, HttpServletRequest request){
        return ResponseEntity.ok(newsReactionsService.createReactoin(reactionDTO,request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> undoReaction(@PathVariable int id){
        return ResponseEntity.ok(newsReactionsService.undoReaction(id));
    }
}
