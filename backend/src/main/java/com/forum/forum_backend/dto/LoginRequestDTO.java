package com.forum.forum_backend.dto;

public record LoginRequestDTO(String email, String password, boolean remember) {
}
