package com.forum.forum_backend.events;

import lombok.Data;

@Data
public class CloudDeleteEvent {
    private final String content;
}
