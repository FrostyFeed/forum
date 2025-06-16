package com.forum.forum_backend.controller;


import com.forum.forum_backend.dto.BanPOSTRequestDTO;
import com.forum.forum_backend.service.BanService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BanController {
    private final BanService banService;

    @PostMapping("/bans")
    public ResponseEntity<String> createBan(@RequestBody BanPOSTRequestDTO banRequest){
        return ResponseEntity.ok(banService.createBan(banRequest));
    }
}
