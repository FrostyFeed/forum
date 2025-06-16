package com.forum.forum_backend.dto;

import com.forum.forum_backend.annotations.TokenAlreadyVerified;
import com.forum.forum_backend.annotations.ValidToken;

public record TokenDTO(@ValidToken @TokenAlreadyVerified String token) {
}
