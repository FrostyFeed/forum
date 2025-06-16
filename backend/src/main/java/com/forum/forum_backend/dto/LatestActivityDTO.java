package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record LatestActivityDTO(int id, String content, int topicId, String topicName, String type, OffsetDateTime creationDate, int threadId) {

}
