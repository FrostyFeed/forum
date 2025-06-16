package com.forum.forum_backend.dto;

import com.forum.forum_backend.entity.Reply;

import java.time.OffsetDateTime;

public record ReplyDTO(int id, String content, OffsetDateTime creationDate, String userName, int userId, String avatarUrl, int upvoteCount, boolean isEdited, boolean isAdmin) {
    public ReplyDTO(Reply reply){
        this(reply.getId(),reply.getContent(),reply.getCreationDate(),reply.getUser().getUsername(),reply.getUser().getId(),reply.getUser().getAvatarUrl(),reply.getUpvoteCount(), reply.isEdited(),
                reply.getUser().getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_Admin")));
    }
}
