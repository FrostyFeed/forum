package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.CreateNewsReactionDTO;
import com.forum.forum_backend.entity.NewsReaction;
import com.forum.forum_backend.repository.NewsReactionRepository;
import com.forum.forum_backend.repository.NewsRepository;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import com.forum.forum_backend.utility.NewsReactionsTypes;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsReactionsService {
    private final NewsReactionRepository newsReactionRepository;
    private final CookieUtilityService cookieUtilityService;
    private final JWTUtility jwtUtility;
    private final UserService userService;
    private final ServiceNews serviceNews;

    public String createReactoin(CreateNewsReactionDTO reactionDTO, HttpServletRequest request) {
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        NewsReaction newsReaction = NewsReaction.builder().user(userService.getUserByEmail(email).orElseThrow()).news(serviceNews.getReferenceById(reactionDTO.newsId())).type(reactionDTO.type()).build();
        undoReaction(reactionDTO.newsId());
        newsReactionRepository.save(newsReaction);
        return "OK";
    }


    public String undoReaction(int id) {
        newsReactionRepository.undoReaction(id);
        return "OK";
    }
}
