package com.forum.forum_backend.dto;

public record BanPOSTRequestDTO(int bannedUserId,int adminId,int duration,String reason,int reportId,boolean deletePostContent) {
}
