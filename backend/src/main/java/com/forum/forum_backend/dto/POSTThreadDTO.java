package com.forum.forum_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record POSTThreadDTO(String content, String title, int topicId, int userId, OffsetDateTime creationDate) {
}
