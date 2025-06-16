package com.forum.forum_backend.dto;

import com.forum.forum_backend.utility.NewsReactionsTypes;

import java.time.OffsetDateTime;

public record NewsDTO(int id, String content, String title, String description, OffsetDateTime creationDate, long dislikes, long likes,
                      NewsReactionsTypes userReaction) {
}
