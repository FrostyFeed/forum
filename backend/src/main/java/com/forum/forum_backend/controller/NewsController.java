package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.CreateNewsDTO;
import com.forum.forum_backend.dto.NewsDTO;
import com.forum.forum_backend.dto.SliceResponse;
import com.forum.forum_backend.dto.UpdateNewsDTO;
import com.forum.forum_backend.service.ServiceNews;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {
    private final ServiceNews newsService;
    @PostMapping("/news")
    public ResponseEntity<String> createNews(@RequestBody CreateNewsDTO newsDTO){
        return ResponseEntity.ok(newsService.createNews(newsDTO));
    }
    @GetMapping("/news")
    public ResponseEntity<SliceResponse<NewsDTO>> getNews(@RequestParam(defaultValue = "0") int page, HttpServletRequest request){
        return  ResponseEntity.ok(newsService.getNews(PageRequest.of(page,10, Sort.by("creationDate").descending()),request));
    }
    @PutMapping("/news")
    public ResponseEntity<NewsDTO> updateNews(@RequestBody UpdateNewsDTO updateNewsDTO){
        return ResponseEntity.ok(newsService.updateNews(updateNewsDTO));
    }
    @DeleteMapping("/news/{id}")
    public ResponseEntity<String> deleteNews(@PathVariable int id){
        return ResponseEntity.ok(newsService.deleteNews(id));
    }
}
