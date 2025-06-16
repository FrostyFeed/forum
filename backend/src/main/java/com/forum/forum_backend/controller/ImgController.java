package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.ImgUploadRequestDTO;
import com.forum.forum_backend.utility.CloudStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ImgController {
    private final CloudStorageService storageService;

    @PostMapping("/img")
    public ResponseEntity<Map<String,String>> uploadImg(@ModelAttribute ImgUploadRequestDTO imgUploadRequestDAO){
        Map<String,String> response = new HashMap<>();
        String url = storageService.upload(imgUploadRequestDAO.imageFile());
        response.put("imageUrl",url);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/img")
    public ResponseEntity<String> deleteImg(@RequestParam String url){
        System.out.printf("Img url %s \n",url);
        storageService.deleteImg(url);
        return ResponseEntity.ok("Ok");
    }
}
