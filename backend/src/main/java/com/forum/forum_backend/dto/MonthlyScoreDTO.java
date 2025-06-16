package com.forum.forum_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MonthlyScoreDTO(@JsonProperty("id") int userId, int reputation, String username, String avatarUrl) {
}
