package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Threads;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record ThreadDTO(int id, String tittle, String content, OffsetDateTime creationDate, String topicTittle, String userName, int repliesCount, int userId, String avatarUrl, OffsetDateTime lastReplyDate, int topicId, boolean isEdited, boolean isAdmin) {
    public ThreadDTO(Threads thread){
        this(thread.getId(),thread.getTittle(),thread.getContent(),thread.getCreationDate(),thread.getTittle(),thread.getUser().getUsername(),thread.getReplies() != null ? thread.getReplies().size() : 0,thread.getUser().getId(),thread.getUser().getAvatarUrl(),thread.getLastReplyDate(),thread.getTopic().getId(), thread.isEdited(),
                thread.getUser().getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_Admin")));
    }
    public static  String formatDate(LocalDateTime date){
        return date.toString();
    }
}
