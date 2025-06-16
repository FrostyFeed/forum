package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Topic;

public record TopicsDTO(int id, String description, String tittle, int threadsCount) {
    public TopicsDTO(Topic topic){
        this(topic.getId(), topic.getDescription(), topic.getTittle(), topic.getThreads().size());
    }
}
