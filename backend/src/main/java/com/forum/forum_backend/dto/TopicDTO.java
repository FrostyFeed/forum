package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Topic;

import java.util.List;

public record TopicDTO(int id, String tittle, List<ThreadDTO> threadDAOList, String description) {
    public TopicDTO(Topic topic){
        this(topic.getId(), topic.getTittle(), topic.getThreads().stream().map(ThreadDTO::new).toList(),topic.getDescription());
    }
}
