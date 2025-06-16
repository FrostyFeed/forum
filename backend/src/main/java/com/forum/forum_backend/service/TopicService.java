package com.forum.forum_backend.service;

import com.forum.forum_backend.dto.TopicDTO;
import com.forum.forum_backend.dto.TopicSaveDTO;
import com.forum.forum_backend.dto.TopicUpdateDTO;
import com.forum.forum_backend.dto.TopicsDTO;
import com.forum.forum_backend.entity.Topic;
import com.forum.forum_backend.exeptions.TopicNotFoundException;
import com.forum.forum_backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService {
    private final TopicRepository topicRepository;
    @Autowired
    public TopicService(TopicRepository topicRepository){
        this.topicRepository = topicRepository;
    }
    public List<TopicsDTO> getAllTopics(){
        List<Topic> topics = (List<Topic>) topicRepository.findAll();
        return topics.stream().map(TopicsDTO::new).toList();
    }
    public TopicDTO getTopic(int id){
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new TopicNotFoundException("Тему з ID " + id + " не знайдено."));

        return new TopicDTO(topic);
    }
    public String saveTopic(TopicSaveDTO topicSaveDAO){
        Topic topic = Topic.builder().tittle(topicSaveDAO.title()).description(topicSaveDAO.desc()).build();
        topicRepository.save(topic);
        return Integer.toString(topic.getId());
    }
    public int updateTopic(TopicUpdateDTO topicUpdateDTO){
        return topicRepository.updateTopicById(topicUpdateDTO.title(),topicUpdateDTO.description(),topicUpdateDTO.id());
    }
    public String deleteTopic(int id){
        topicRepository.findById(id).ifPresent(topicRepository::delete);
        return "Ok";
    }

    public Optional<Topic> findById(int i) {
        return topicRepository.findById(i);
    }
}
