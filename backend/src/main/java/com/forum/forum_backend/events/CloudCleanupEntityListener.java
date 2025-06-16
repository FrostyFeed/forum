package com.forum.forum_backend.events;

import jakarta.persistence.PreRemove;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CloudCleanupEntityListener {
    private static ApplicationEventPublisher publisher;
    @Autowired
    public void init(ApplicationEventPublisher publisher) {
        CloudCleanupEntityListener.publisher = publisher;
    }
    @PreRemove
    public void onPreRemove(Object entity) {
        if (entity instanceof HasCloudResource resource) {
            publisher.publishEvent(new CloudDeleteEvent(resource.getContent()));
        }
    }
}
