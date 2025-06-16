package com.forum.forum_backend.controller;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.service.ReplyService;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ReplyController {
    private final ReplyService replyService;
    private final JWTUtility jwtUtility;
    private final CookieUtilityService cookieUtilityService;
    @GetMapping("/replies/{id}")
    public ResponseEntity<SliceResponse<ReplyDTO>> getReplies(@PathVariable int id, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "creationDate,desc") String sort){
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];

        Sort sortOrder;
        if (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")) {
            sortOrder = Sort.by(sortField).descending();
        } else {
            sortOrder = Sort.by(sortField).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);

        return ResponseEntity.ok(replyService.getAllReplies(id,pageable));

    }
    @PostMapping("/reply")
    public ResponseEntity<ReplyDTO> saveReply(@RequestBody SaveReplyRequestDTO replyRequestDAO, HttpServletRequest request){
        return ResponseEntity.ok(replyService.saveReply(replyRequestDAO,request));
    }
    @PostMapping("/reply/{id}/upvote")
    public ResponseEntity<String> upvoteReply(@PathVariable int id,HttpServletRequest request){
        String jwt = cookieUtilityService.extractJwt(request);
        String email = jwtUtility.extractEmail(jwt);
        return replyService.upvote(email,id);
    }
    @PutMapping("/reply")
    public ResponseEntity<PUTReplyResponseDTO> updateReply(@RequestBody PUTReplyDTO putReplyDTO,HttpServletRequest request){
        return replyService.updateReply(putReplyDTO,request);
    }
    @DeleteMapping("/reply/{id}")
    public ResponseEntity<String> deleteReply(@PathVariable int id,HttpServletRequest request){
        replyService.deleteReply(id,request);
        return ResponseEntity.ok("ok");

    }
    @GetMapping("/reply/best/{userId}")
    public ResponseEntity<List<UsersBestRepliesDTO>> getUsersBestReplies(@PathVariable int userId,@RequestParam("period")String period){
        return ResponseEntity.ok(replyService.getUsersBestReplues(userId,period));
    }

}
