package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record SaveReplyRequestDTO(String content, int threadId, OffsetDateTime creationDate) {
}
