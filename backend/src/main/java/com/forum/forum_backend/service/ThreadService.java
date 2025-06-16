package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.*;
import com.forum.forum_backend.entity.Threads;
import com.forum.forum_backend.entity.Topic;
import com.forum.forum_backend.entity.User;
import com.forum.forum_backend.exeptions.NotYourEntity;
import com.forum.forum_backend.repository.ThreadRepository;
import com.forum.forum_backend.specification.ThreadSpecification;
import com.forum.forum_backend.utility.CloudStorageService;
import com.forum.forum_backend.utility.CookieUtilityService;
import com.forum.forum_backend.utility.JWTUtility;
import com.forum.forum_backend.utility.StatsType;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ThreadService {
    private final ThreadRepository threadRepository;
    private final JWTUtility jwtUtility;
    private final CookieUtilityService cookieUtilityService;
    private final CloudStorageService cloudStorageService;
    private final PostStatsService postStatsService;
    private final UserService userService;
    private final TopicService topicService;
    public void addThread(Threads thread){
        threadRepository.save(thread);
    }
    public List<ThreadDTO> getLastThreads(){
        List<Threads> threadsList = threadRepository.findTop5ByOrderByCreationDateDesc();
        return threadsList.stream().map(ThreadDTO::new).toList();
    }
    public Optional<Threads> getThread(int id){
        return threadRepository.findById(id);
    }
    public ThreadDTO saveThread(POSTThreadDTO postThreadDTO){
        Topic topic = topicService.findById(postThreadDTO.topicId())
                .orElseThrow(() -> new EntityNotFoundException("Тему з ID: " + postThreadDTO.topicId() + " не знайдено."));

        User user = userService.getUserById(postThreadDTO.userId())
                .orElseThrow(() -> new EntityNotFoundException("Користувача з ID: " + postThreadDTO.userId() + " не знайдено."));

        Threads thread = Threads.builder()
                .creationDate(postThreadDTO.creationDate())
                .content(postThreadDTO.content())
                .tittle(postThreadDTO.title())
                .topic(topic)
                .user(user)
                .build();
        postStatsService.increaseCount(YearMonth.now().toString(), StatsType.POST);
        threadRepository.save(thread);
        return new ThreadDTO(thread);
    }

    public SliceResponse<ThreadDTO> getThreadsByTopic(int id, Pageable page) {
        Slice<Threads> threads = threadRepository.findAllByTopicId(id, page);
        Slice<ThreadDTO> threadDAOList = threads.map(ThreadDTO::new);
        return new SliceResponse<>(threadDAOList);
    }

    public ThreadPUTResponseDTO updateThread(RecordUpdateDTO recordUpdateDTO, HttpServletRequest request) {
        Threads thread = threadRepository.findById(recordUpdateDTO.id())
                .orElseThrow(() -> new EntityNotFoundException("Пост не знайдено."));
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        if (thread.getUser().getEmail().equals(email)) {
            thread.setTittle(recordUpdateDTO.title());
            thread.setContent(recordUpdateDTO.content());
            thread.setEdited(true);
            threadRepository.save(thread);
            return new ThreadPUTResponseDTO(thread.getId(), thread.getContent(), thread.getTittle(), thread.getCreationDate());
        } else {
            throw new NotYourEntity();
        }
    }

    public ThreadDeleteResponceDTO deleteThread(int id, HttpServletRequest request) {
        String email = jwtUtility.extractEmail(cookieUtilityService.extractJwt(request));
        Threads thread = threadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Пост не знайдено."));

        if(thread.getUser().getEmail().equals(email)){
            List<String> links = new ArrayList<>();
            Pattern pattern = Pattern.compile("src=\"(.*?)\"");
            Matcher matcher = pattern.matcher(thread.getContent());

            while (matcher.find()) {
                links.add(matcher.group(1));  // group(1) contains the URL inside src=""
            }
            int topicId = thread.getTopic().getId();
            threadRepository.delete(thread);
            links.stream().distinct().forEach(cloudStorageService::deleteImg);
            return new ThreadDeleteResponceDTO(topicId);
        }else{
            throw new NotYourEntity();
        }

    }

    public String getRandom() {
        int randomId = threadRepository.findRandomRecord();
        return Integer.toString(randomId);
    }

    public SliceResponse<ThreadDTO> searchThreads(Integer topicId, Integer userId, Pageable pageable) {
        Specification<Threads> spec = ThreadSpecification.findByCriteria(topicId, userId);

        // 2. Call the findAll method that accepts a Specification
        Slice<Threads> threads = threadRepository.findAll(spec, pageable);

        // The rest of the logic is the same
        Slice<ThreadDTO> threadDAOList = threads.map(ThreadDTO::new);
        return new SliceResponse<>(threadDAOList);
    }

    public void save(Threads threads) {
        threadRepository.save(threads);
    }

    public Optional<Threads> findById(int i) {
        return threadRepository.findById(i);
    }
}
