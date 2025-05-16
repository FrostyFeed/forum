package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Topic;

public record TopicDAO(int id, String description, String tittle, int threadsCount) {
    public TopicDAO(Topic topic){
        this(topic.getId(), topic.getDescription(), topic.getTittle(), topic.getThreads().size());
    }
}
