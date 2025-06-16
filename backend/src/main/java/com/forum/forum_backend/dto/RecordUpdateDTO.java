package com.forum.forum_backend.dto;

import java.time.OffsetDateTime;

public record RecordUpdateDTO(String content, int userId, OffsetDateTime creationDate,int id,String title) {
}
