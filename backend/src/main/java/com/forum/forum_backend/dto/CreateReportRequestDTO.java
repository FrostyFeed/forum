package com.forum.forum_backend.dto;

public record CreateReportRequestDTO(String type, int postId, String reason) {
}
