package com.forum.forum_backend.dto;

import com.forum.forum_backend.utility.NewsReactionsTypes;

public record CreateNewsReactionDTO(int newsId, NewsReactionsTypes type) {
}
