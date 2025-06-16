package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record ThreadPUTResponseDTO(int id, String content, String title, OffsetDateTime creationDate) {
}
