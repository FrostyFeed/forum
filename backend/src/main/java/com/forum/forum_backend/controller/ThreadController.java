package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.service.ThreadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ThreadController {
    private final ThreadService threadService;
    @Autowired
    public ThreadController(ThreadService threadService){
        this.threadService = threadService;
    }
    @GetMapping("/thread/latest")
    public ResponseEntity<List<ThreadDTO>> getLatestThreads(){
        return ResponseEntity.of(Optional.ofNullable(threadService.getLastThreads()));
    }
    @GetMapping("/thread/{id}")
    public ThreadDTO getThread(@PathVariable int id){
        return new ThreadDTO(threadService.getThread(id).get());
    }
    @PostMapping("/thread")
    public ResponseEntity<ThreadDTO> saveThread(@RequestBody POSTThreadDTO postThreadDTO){
        return ResponseEntity.ok(threadService.saveThread(postThreadDTO));
    }
    @GetMapping("/thread")
    public ResponseEntity<?> searchThreads(
                                            @RequestParam(required = false) Integer topicId,
                                            @RequestParam(required = false) Integer userId,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            @RequestParam(defaultValue = "creationDate,desc") String sort
    ) {

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort sortOrder = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, size, sortOrder);

        SliceResponse<ThreadDTO> result = threadService.searchThreads(topicId, userId, pageable);

        return ResponseEntity.ok(result);
    }
    @PutMapping("/thread")
    public ResponseEntity<ThreadPUTResponseDTO> updateThread(@RequestBody RecordUpdateDTO recordUpdateDTO, HttpServletRequest request){
        return ResponseEntity.ok(threadService.updateThread(recordUpdateDTO,request));
    }
    @DeleteMapping("/thread/{id}")
    public ResponseEntity<ThreadDeleteResponceDTO> deleteThread(@PathVariable int id,HttpServletRequest request){
        return ResponseEntity.ok(threadService.deleteThread(id,request));
    }
    @GetMapping("/thread/random")
    public ResponseEntity<String> getRandomThread(){
        return ResponseEntity.ok(threadService.getRandom());
    }
}
