package com.forum.forum_backend.dto;

import com.forum.forum_backend.annotations.PasswordMatches;

@PasswordMatches
public record ChangePasswordRequestDTO(String jwt,String password,String confirmPassword) {
}
