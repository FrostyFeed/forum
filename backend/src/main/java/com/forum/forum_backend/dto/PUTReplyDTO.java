package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record PUTReplyDTO(int id, String content, int userId, OffsetDateTime creationDate) {
}
