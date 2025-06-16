package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record PUTReplyResponseDTO(String content, OffsetDateTime creationDate) {
}
