package com.forum.forum_backend.events;

import com.forum.forum_backend.utility.CloudStorageService;
import com.forum.forum_backend.utility.StringUtill;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CloudDeleteListener {
    private final StringUtill stringUtill;
    private final CloudStorageService cloudStorageService;
    @Async
    @EventListener
    public void handleCloudDelete(CloudDeleteEvent event) {
        String url = event.getContent();
        stringUtill.extractImgs(url).forEach(cloudStorageService::deleteImg);
    }
}
