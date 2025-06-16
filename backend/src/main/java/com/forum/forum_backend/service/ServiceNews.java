package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.CreateNewsDTO;
import com.forum.forum_backend.dto.NewsDTO;
import com.forum.forum_backend.dto.SliceResponse;
import com.forum.forum_backend.dto.UpdateNewsDTO;
import com.forum.forum_backend.entity.News;
import com.forum.forum_backend.entity.NewsReaction;
import com.forum.forum_backend.repository.NewsRepository;
import com.forum.forum_backend.repository.UserRepository;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import com.forum.forum_backend.utility.NewsReactionsTypes;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceNews {
    private final NewsRepository newsRepository;
    private final UserService userService;
    private final CookieUtilityService cookieUtilityService;
    private final JWTUtility jwtUtility;

    public String createNews(CreateNewsDTO newsDTO) {
        News news = News.builder().title(newsDTO.title()).description(newsDTO.description()).admin(userService.getReferenceById(newsDTO.userId())).content(newsDTO.content()).creationDate(OffsetDateTime.now()).build();
        newsRepository.save(news);
        return Integer.toString(news.getId());
    }

    public SliceResponse<NewsDTO> getNews(PageRequest creationDate, HttpServletRequest request) {
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        Slice<News> newsSlice = newsRepository.findAllBy(creationDate);
        Slice<NewsDTO> newsDTOSlice = newsSlice.map(n -> new NewsDTO(n.getId(),
                n.getContent(),
                n.getTitle(),
                n.getDescription(),
                n.getCreationDate(),
                n.getReactions().stream().filter(a -> a.getType() == NewsReactionsTypes.DISLIKE).count(),
                n.getReactions().stream().filter(a -> a.getType() == NewsReactionsTypes.LIKE).count(),
                n.getReactions().stream().filter(a-> !email.isEmpty() && a.getUser().getEmail().equals(email)).findFirst().map(NewsReaction::getType).orElse(null)));
        return new SliceResponse<>(newsDTOSlice);
    }

    public NewsDTO updateNews(UpdateNewsDTO updateNewsDTO) {
        News news = newsRepository.findById(updateNewsDTO.id());
        news.setTitle(updateNewsDTO.title());
        news.setContent(updateNewsDTO.content());
        news.setDescription(updateNewsDTO.description());
        newsRepository.save(news);
        return new NewsDTO(news.getId(),news.getContent(),news.getTitle(),news.getDescription(),news.getCreationDate(),0,0,NewsReactionsTypes.LIKE);
    }

    public String deleteNews(int id) {
        newsRepository.deleteById(id);
        return "OK";
    }

    public News getReferenceById(int i) {
        return newsRepository.getReferenceById(i);
    }
}
