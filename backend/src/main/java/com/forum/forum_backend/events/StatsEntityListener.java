package com.forum.forum_backend.events;

import jakarta.persistence.PostPersist;
import jakarta.persistence.PreRemove;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class StatsEntityListener {
    private static ApplicationEventPublisher publisher;
    @Autowired
    public void init(ApplicationEventPublisher publisher) {
        StatsEntityListener.publisher = publisher;
    }
    @PostPersist
    public void onPreRemove(Object entity) {
        if (entity instanceof HasStatsType resource) {

            if (publisher != null) {
                publisher.publishEvent(new StatsEvent(resource.getStatsType()));
            } else {
                System.err.println("WARN: ApplicationEventPublisher is not available in StatsEntityListener.");
            }
        }
    }
}
