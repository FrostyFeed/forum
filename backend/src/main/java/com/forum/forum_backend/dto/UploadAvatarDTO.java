package com.forum.forum_backend.dto;

import org.springframework.web.multipart.MultipartFile;

public record UploadAvatarDTO(String email, MultipartFile avatar) {
}
