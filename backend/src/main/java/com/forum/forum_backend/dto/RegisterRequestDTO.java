package com.forum.forum_backend.dto;

import com.forum.forum_backend.annotations.PasswordMatches;
import com.forum.forum_backend.annotations.UniqueEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PasswordMatches
public class RegisterRequestDTO {

    @NotBlank
    @Email
    @UniqueEmail
    private String email;
    @NotBlank
    private String password;
    @NotBlank private String confirmPassword;
    @NotBlank
    private String username;
}
