package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Roles;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

public record UserDataDTO(
        String username,
        LocalDate registerDate,
        OffsetDateTime lastSeen,
        String avatarUrl,
        int replyCount,
        int threadCount,
        int reputation,
        boolean isAdmin
) {
}