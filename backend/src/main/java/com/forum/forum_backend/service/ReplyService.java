package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.entity.Reply;
import com.forum.forum_backend.entity.Threads;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.exeptions.NotYourEntity;
import com.forum.forum_backend.interfaces.Post;
import com.forum.forum_backend.repository.RepliesRepository;
import com.forum.forum_backend.repository.ThreadRepository;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplyService {
    private final RepliesRepository repliesRepository;
    private final UserService userService;
    private final ThreadRepository threadRepository;
    private final JWTUtility jwtUtility;
    private final MonthlyScoreService monthlyScoreService;
    private final CookieUtilityService cookieUtilityService;
    public SliceResponse<ReplyDTO> getAllReplies(int threadId, Pageable page){
        Slice<Reply> threads = repliesRepository.findByThreadId(threadId,page);
        Slice<ReplyDTO> replyDAOS = threads.map(ReplyDTO::new);
        return new SliceResponse<>(replyDAOS);
    }
    public ReplyDTO saveReply(SaveReplyRequestDTO replyRequestDAO, HttpServletRequest request){
        String jwt = cookieUtilityService.extractJwt(request);
        User user = userService.getUserByEmail(jwtUtility.extractEmail(jwt)).orElseThrow(() -> new EntityNotFoundException("Користувача не знайдено"));
        Threads thread = threadRepository.findById(replyRequestDAO.threadId()).orElseThrow(() -> new EntityNotFoundException("Пост не знайдено"));
        Reply reply = new Reply(replyRequestDAO.content(), replyRequestDAO.creationDate(),thread,user);
        repliesRepository.save(reply);
        return new ReplyDTO(reply);

    }

    public ResponseEntity<String> upvote(String email, int id) {
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Користувача не знайдено"));
        Reply reply = repliesRepository.findById(id);
        if(user.getUpvotes().contains(reply)){
            user.getUpvotes().remove(reply);
            userService.decreaseUserReputation(reply.getUser().getId());
            monthlyScoreService.removeScore(reply.getUser().getId());
            reply.getUpvotedBy().remove(user);
        }else{
            user.getUpvotes().add(reply);
            userService.increaseUserReputation(reply.getUser().getId());
            monthlyScoreService.addScore(reply.getUser().getId());
            reply.getUpvotedBy().add(user);
        }
        userService.save(user);
        return ResponseEntity.ok("ok");

    }
    public ResponseEntity<PUTReplyResponseDTO> updateReply(PUTReplyDTO putReplyDTO,HttpServletRequest request){
        Reply reply = repliesRepository.findById(putReplyDTO.id());
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        if(reply.getUser().getEmail().equals(email)){
            reply.setContent(putReplyDTO.content());
            reply.setCreationDate(putReplyDTO.creationDate());
            reply.setEdited(true);
            repliesRepository.save(reply);
            return ResponseEntity.ok(new PUTReplyResponseDTO(reply.getContent(),reply.getCreationDate()));
        }else{
            throw new NotYourEntity();
        }
    }
    public void deleteReply(int id,HttpServletRequest request){
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        int userId = userService.getUserId(email);
        Reply reply = repliesRepository.findById(id);
        repliesRepository.delete(reply);
    }

    public List<UsersBestRepliesDTO> getUsersBestReplues(int userId, String period) {
        boolean thisMonth = period.equals("month");
        List<Reply> replyList = repliesRepository.findTopRepliesByUser(userService.getReferenceById(userId),thisMonth, YearMonth.now().getYear(), YearMonth.now().getMonthValue(), PageRequest.of(0,3));
        return replyList.stream().map(r -> new UsersBestRepliesDTO(r.getId(),r.getContent(),r.getThread().getId(),r.getUpvoteCount(),r.getThread().getTittle(),r.getThread().getContent())).toList();
    }

    public void save(Reply reply) {
        repliesRepository.save(reply);
    }

    public Post findById(int i) {
        return repliesRepository.findById(i);
    }
}
