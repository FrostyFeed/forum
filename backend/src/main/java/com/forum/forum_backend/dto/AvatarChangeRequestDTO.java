package com.forum.forum_backend.dto;

import org.springframework.web.multipart.MultipartFile;

public record AvatarChangeRequestDTO(MultipartFile newAvatar, int id,String oldAvatar) {
}
