package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.TopicDTO;
import com.forum.forum_backend.dto.TopicSaveDTO;
import com.forum.forum_backend.dto.TopicUpdateDTO;
import com.forum.forum_backend.dto.TopicsDTO;
import com.forum.forum_backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TopicController {
    private final TopicService topicService;
    @GetMapping("/topics")
    public ResponseEntity<List<TopicsDTO>> getAllTopics(){
        return ResponseEntity.of(Optional.ofNullable(topicService.getAllTopics()));
    }
    @GetMapping("/topic/{id}")
    public ResponseEntity<TopicDTO> getTopic(@PathVariable int id){
        TopicDTO topicDAO = topicService.getTopic(id);
        return ResponseEntity.ok(topicDAO);
    }
    @PostMapping("/topic")
    public ResponseEntity<Map<String,String>> saveTopic(@RequestBody TopicSaveDTO topicSaveDAO){
        String topicId = topicService.saveTopic(topicSaveDAO);
        Map<String,String> response = new HashMap<>();
        response.put("topicId",topicId);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/topic")
    public ResponseEntity<String> updateTopic(@RequestBody TopicUpdateDTO topicUpdateDTO){
        topicService.updateTopic(topicUpdateDTO);
        return ResponseEntity.ok("ok");
    }
    @DeleteMapping("/topic/{id}")
    public ResponseEntity<String> deleteTopic(@PathVariable int id){
        return ResponseEntity.ok(topicService.deleteTopic(id));
    }
}
