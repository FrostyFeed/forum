package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record UpdateNewsDTO(String content, int userId, OffsetDateTime creationDate,String description,String title,int id) {
}
