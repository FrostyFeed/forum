package com.forum.forum_backend.events;

import com.forum.forum_backend.service.PostStatsService;
import com.forum.forum_backend.utility.StatsType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.YearMonth;

@Component
@RequiredArgsConstructor
public class StatsListener {
    private final PostStatsService postStatsService;
    @Async
    @EventListener
    public void increaseStats(StatsEvent event){
        StatsType type = event.type();
        postStatsService.increaseCount(YearMonth.now().toString(), type);
    }
}
