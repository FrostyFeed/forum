package com.forum.forum_backend.dto;

public record UsersBestRepliesDTO(int id,String content,int threadId,int upvotes,String threadTitle,String threadContent) {
}
