package com.forum.forum_backend.dto;

import org.springframework.web.multipart.MultipartFile;

public record ImgUploadRequestDTO(MultipartFile imageFile) {
}
