package com.forum.forum_backend.schedule;

import com.forum.forum_backend.events.CloudCleanupEntityListener;
import com.forum.forum_backend.repository.BanRepository;
import com.forum.forum_backend.utility.BanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
public class UserBanScheduler {
    private final BanRepository banRepository;
    @Scheduled(fixedDelay = 60_00)
    public void unbanUsers(){
        int affected = banRepository.unbanUsers(BanStatus.EXPIRED,BanStatus.ACTIVE, LocalDateTime.now());
    }
}
